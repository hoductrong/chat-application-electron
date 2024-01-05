import type { Consumer, Provider } from './constants';
import { BankKey, QRProvider, banksObject } from './constants';
import { QRPay } from './qr-pay';
const realData =
  '00020101021138580010A000000727012800069704180114581100007157520208QRIBFTTA53037045802VN630438C8';

describe('QRPay', () => {
  let qrPay: QRPay;

  beforeEach(() => {
    qrPay = new QRPay();
  });

  describe('parse', () => {
    it('should valid qrpay', () => {
      const expectedProvider: Provider = {
        fieldId: '38',
        guid: 'A000000727',
        name: QRProvider.VIETQR,
        service: 'QRIBFTTA',
      };
      const expectedConsumer: Consumer = {
        bankBin: '970418',
        bankNumber: '58110000715752',
      };

      qrPay.parse(realData);

      expect(qrPay.provider).toEqual(expectedProvider);
      expect(qrPay.consumer).toEqual(expectedConsumer);
    });

    it('should generate valid string with correct data', () => {
      const obj = {
        bankBin: banksObject[BankKey.BIDV].bin,
        bankNumber: '58110000715752',
      };

      const qrPay = QRPay.initVietQR(obj);

      expect(qrPay.build()).toEqual(realData);
    });
  });
});
