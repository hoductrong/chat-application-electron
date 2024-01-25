/* 
 * QR Code generator demo (C++)
 * 
 * Run this command-line program with no arguments. The program computes a bunch of demonstration
 * QR Codes and prints them to the console. Also, the SVG code for one QR Code is printed as a sample.
 * 
 * Copyright (c) Project Nayuki. (MIT License)
 * https://www.nayuki.io/page/qr-code-generator-library
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * - The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 * - The Software is provided "as is", without warranty of any kind, express or
 *   implied, including but not limited to the warranties of merchantability,
 *   fitness for a particular purpose and noninfringement. In no event shall the
 *   authors or copyright holders be liable for any claim, damages or other
 *   liability, whether in an action of contract, tort or otherwise, arising from,
 *   out of or in connection with the Software or the use or other dealings in the
 *   Software.
 */

#include <climits>
#include <cstdint>
#include <cstdlib>
#include <cstring>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include "qrcodegen.hpp"
#include "base64.h"
#include <emscripten/emscripten.h>
#include <math.h>
#include <emscripten/bind.h>
#include "lodepng.h"

using namespace emscripten;

using std::uint8_t;
using qrcodegen::QrCode;
using qrcodegen::QrSegment;

std::string QrCodeToBase64(const QrCode &qr, int scale = 4, int border = 4) {
    int size = qr.getSize();
    int width = (size + border * 2) * scale;
    std::vector<unsigned char> image(width * width * 4);
    std::vector<unsigned char> png;

		for (int y = -border; y < size + border; y++) {
        for (int x = -border; x < size + border; x++) {
            int scaledY = (y + border) * scale;
            int scaledX = (x + border) * scale;
            for (int dy = 0; dy < scale; dy++) {
                for (int dx = 0; dx < scale; dx++) {
                    int offset = ((scaledY + dy) * width + (scaledX + dx)) * 4; // Corrected offset
                    if (qr.getModule(x, y)) {
                        // Black pixel
                        image[offset + 0] = 0;   // R
                        image[offset + 1] = 0;   // G
                        image[offset + 2] = 0;   // B
                        image[offset + 3] = 255; // A
                    } else {
                        // White pixel
                        image[offset + 0] = 255; // R
                        image[offset + 1] = 255; // G
                        image[offset + 2] = 255; // B
                        image[offset + 3] = 255; // A
                    }
                }
            }
        }
    }
    unsigned error = lodepng::encode(png, image, width, width);
    if (error) {
        std::cout << "encoder error " << error << ": " << lodepng_error_text(error) << std::endl;
    }

		std::string base64 = base64_encode(png.data(), png.size());


    return base64;
}

emscripten::val QrCodeToBuffer(const QrCode &qr, int scale = 4, int border = 4) {
    int size = qr.getSize();
    int width = (size + border * 2) * scale;
    std::vector<unsigned char> image(width * width * 4);
    std::vector<unsigned char> png;

		for (int y = -border; y < size + border; y++) {
        for (int x = -border; x < size + border; x++) {
            int scaledY = (y + border) * scale;
            int scaledX = (x + border) * scale;
            for (int dy = 0; dy < scale; dy++) {
                for (int dx = 0; dx < scale; dx++) {
                    int offset = ((scaledY + dy) * width + (scaledX + dx)) * 4; // Corrected offset
                    if (qr.getModule(x, y)) {
                        // Black pixel
                        image[offset + 0] = 0;   // R
                        image[offset + 1] = 0;   // G
                        image[offset + 2] = 0;   // B
                        image[offset + 3] = 255; // A
                    } else {
                        // White pixel
                        image[offset + 0] = 255; // R
                        image[offset + 1] = 255; // G
                        image[offset + 2] = 255; // B
                        image[offset + 3] = 255; // A
                    }
                }
            }
        }
    }
    unsigned error = lodepng::encode(png, image, width, width);
    if (error) {
        std::cout << "encoder error " << error << ": " << lodepng_error_text(error) << std::endl;
    }

		emscripten::val buffer = emscripten::val(emscripten::typed_memory_view(png.size(), png.data()));


    return buffer;
}


// Function prototypes
std::string toSvgString(const QrCode &qr, int border);
void printQr(const QrCode &qr);


// The main application program.
int main() {
	return EXIT_SUCCESS;
}

//     // Creates a single QR Code, then prints it to the console.
emscripten::val genQrCode(std::string input, int scale, int border) {
	const char* text = input.c_str();
	const QrCode::Ecc errCorLvl = QrCode::Ecc::HIGH;  // Error correction level
	
	// Make and print the QR Code symbol
	const QrCode qr = QrCode::encodeText(text, errCorLvl);

	const emscripten::val val = QrCodeToBuffer(qr, scale, border);

	return val;
}

std::string genQrCodeSvg(std::string input, int scale, int border) {
	const char* text = input.c_str();
	const QrCode::Ecc errCorLvl = QrCode::Ecc::MEDIUM;  // Error correction level
	
	// Make and print the QR Code symbol
	const QrCode qr = QrCode::encodeText(text, errCorLvl);

	const std::string svg = toSvgString(qr, border);

	return svg;
}

EMSCRIPTEN_BINDINGS(my_module) {
    function("genQrCode", &genQrCode);
    function("genQrCodeSvg", &genQrCodeSvg);
}

/*---- Utilities ----*/

// Returns a string of SVG code for an image depicting the given QR Code, with the given number
// of border modules. The string always uses Unix newlines (\n), regardless of the platform.
std::string toSvgString(const QrCode &qr, int border) {
	if (border < 0)
		throw std::domain_error("Border must be non-negative");
	if (border > INT_MAX / 2 || border * 2 > INT_MAX - qr.getSize())
		throw std::overflow_error("Border too large");
	
	std::ostringstream sb;
	sb << "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
	sb << "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n";
	sb << "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"0 0 ";
	sb << (qr.getSize() + border * 2) << " " << (qr.getSize() + border * 2) << "\" stroke=\"none\">\n";
	sb << "\t<rect width=\"100%\" height=\"100%\" fill=\"#FFFFFF\"/>\n";
	sb << "\t<path d=\"";
	for (int y = 0; y < qr.getSize(); y++) {
		for (int x = 0; x < qr.getSize(); x++) {
			if (qr.getModule(x, y)) {
				if (x != 0 || y != 0)
					sb << " ";
				sb << "M" << (x + border) << "," << (y + border) << "h1v1h-1z";
			}
		}
	}
	sb << "\" fill=\"#000000\"/>\n";
	sb << "</svg>\n";
	return sb.str();
}
