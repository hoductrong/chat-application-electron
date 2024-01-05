#include <stdbool.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "qrcodegen.h"
#include <emscripten.h>

// Function prototypes
static void printQr(const uint8_t qrcode[]);
char *toSvgString(const uint8_t qrcode[]);

// The main application program.
int main(void)
{
	return EXIT_SUCCESS;
}

// Creates a single QR Code, then prints it to the console.
char *genQrCode(char *text)
{
	double start = emscripten_get_now();

	enum qrcodegen_Ecc errCorLvl = qrcodegen_Ecc_LOW; // Error correction level
	// Make and print the QR Code symbol
	uint8_t qrcode[qrcodegen_BUFFER_LEN_MAX];
	uint8_t tempBuffer[qrcodegen_BUFFER_LEN_MAX];
	bool ok = qrcodegen_encodeText(text, tempBuffer, qrcode, errCorLvl, qrcodegen_VERSION_MIN, qrcodegen_VERSION_MAX, qrcodegen_Mask_AUTO, true);
	if (ok)
	{
		char *res = toSvgString(qrcode);

		double end = emscripten_get_now();
		// Calculate the interval in milliseconds
		double interval = end - start;

		printf("someFunction() took %f milliseconds to execute \n", interval);
		return res;
	}

	return "";
}

/*---- Utilities ----*/

// Prints the given QR Code to the console.
static void printQr(const uint8_t qrcode[])
{
	int size = qrcodegen_getSize(qrcode);
	int border = 4;
	for (int y = -border; y < size + border; y++)
	{
		for (int x = -border; x < size + border; x++)
		{
			fputs((qrcodegen_getModule(qrcode, x, y) ? "##" : "  "), stdout);
		}
		fputs("\n", stdout);
	}
	fputs("\n", stdout);
}

// Function to append a string to another string
void append(char *s, const char *t)
{
	strcat(s, t);
}

char *toSvgString(const uint8_t qrcode[])
{
	int size = qrcodegen_getSize(qrcode);
	int border = 4;
	char svg[10000] = "";
	char char_arr[100];

	append(svg, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
	append(svg, "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n");
	append(svg, "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"0 0 ");
	sprintf(char_arr, "%d", (size + border * 2));
	append(svg, char_arr);
	append(svg, " ");
	sprintf(char_arr, "%d", (size + border * 2));
	append(svg, char_arr);
	append(svg, "\" stroke=\"none\">\n");
	append(svg, "\t<rect width=\"100%\" height=\"100%\" fill=\"#FFFFFF\"/>\n");
	append(svg, "\t<path d=\"");

	for (int y = -border; y < size + border; y++)
	{
		for (int x = -border; x < size + border; x++)
		{
			// Create SVG rectangle for each module
			if (qrcodegen_getModule(qrcode, x, y))
			{
				if (x != 0 || y != 0)
				{
					append(svg, " ");
				}
				append(svg, "M");
				sprintf(char_arr, "%d", (x + border));
				append(svg, char_arr);
				append(svg, ",");
				sprintf(char_arr, "%d", (y + border));
				append(svg, char_arr);
				append(svg, "h1v1h-1z");
			}
		}
	}

	append(svg, "\" fill=\"#000000\"/>\n");
	append(svg, "</svg>\n");

	return svg;
}