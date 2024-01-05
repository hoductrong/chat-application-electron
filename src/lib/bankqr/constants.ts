import type { Message } from '../types';

export type BankQrWorkerResponse = {
  id: number;
  data?: string;
  error?: string;
};

export type BankQrWorkerRequest = {
  id: number;
  message: Message;
};

export type BankAccountMessage = {
  bankNumber: string;
  bankName: BankKey;
};

export class AdditionalData {
  billNumber?: string;
  mobileNumber?: string;
  store?: string;
  loyaltyNumber?: string;
  reference?: string;
  customerLabel?: string;
  terminal?: string;
  purpose?: string;
  dataRequest?: string;
}

export class Consumer {
  bankBin?: string;
  bankNumber?: string;
}

export class Merchant {
  id?: string;
  name?: string;
}

export interface Bank {
  key: BankKey;
  code: BankCode;
  name: string;
  shortName: string;
  bin: string;
  vietQRStatus: number;
  lookupSupported?: number;
  swiftCode?: string | null;
  keywords?: string;
  prefixNumber?: string[];
}

export enum QRProvider {
  VIETQR = 'VIETQR',
}

export enum QRProviderGUID {
  VIETQR = 'A000000727',
}

export enum FieldID {
  VERSION = '00',
  INIT_METHOD = '01',
  VIETQR = '38',
  CATEGORY = '52',
  CURRENCY = '53',
  AMOUNT = '54',
  TIP_AND_FEE_TYPE = '55',
  TIP_AND_FEE_AMOUNT = '56',
  TIP_AND_FEE_PERCENT = '57',
  NATION = '58',
  MERCHANT_NAME = '59',
  CITY = '60',
  ZIP_CODE = '61',
  ADDITIONAL_DATA = '62',
  CRC = '63',
}

export enum Version {
  V1 = '01',
}
export enum InitMethod {
  STATIC = '11',
  DYNAMIC = '12',
}

export enum Currency {
  VND = '704',
}

export enum Nation {
  VIETNAM = 'VN',
}

export enum ProviderFieldID {
  GUID = '00',
  DATA = '01',
  SERVICE = '02',
}

export enum VietQRService {
  BY_ACCOUNT_NUMBER = 'QRIBFTTA', // Dịch vụ chuyển nhanh NAPAS247 đến Tài khoản
  BY_CARD_NUMBER = 'QRIBFTTC', // Dịch vụ chuyển nhanh NAPAS247 đến Thẻ
}

export enum VietQRConsumerFieldID {
  BANK_BIN = '00',
  BANK_NUMBER = '01',
}

export enum AdditionalDataID {
  BILL_NUMBER = '01', // Số hóa đơn
  MOBILE_NUMBER = '02', // Số ĐT
  STORE_LABEL = '03', // Mã cửa hàng
  LOYALTY_NUMBER = '04', // Mã khách hàng thân thiết
  REFERENCE_LABEL = '05', // Mã tham chiếu
  CUSTOMER_LABEL = '06', // Mã khách hàng
  TERMINAL_LABEL = '07', // Mã số điểm bán
  PURPOSE_OF_TRANSACTION = '08', // Mục đích giao dịch
  ADDITIONAL_CONSUMER_DATA_REQUEST = '09', // Yêu cầu dữ liệu KH bổ sung
}

export class Provider {
  fieldId?: string;
  name?: QRProvider;
  guid?: string;
  service?: string;
}

export enum BankKey {
  ABBANK = 'abbank',
  ACB = 'acb',
  AGRIBANK = 'agribank',
  BAC_A_BANK = 'bacabank',
  BAOVIET_BANK = 'baoviet',
  BIDC = 'bidc',
  BIDV = 'bidv',
  CAKE = 'cake',
  CBBANK = 'cbbank',
  CIMB = 'cimb',
  COOP_BANK = 'coopbank',
  DBS_BANK = 'dbsbank',
  DONG_A_BANK = 'dongabank',
  EXIMBANK = 'eximbank',
  GPBANK = 'gpbank',
  HDBANK = 'hdbank',
  HONGLEONG_BANK = 'hongleongbank',
  HSBC = 'hsbc',
  IBK_HCM = 'ibkhcm',
  IBK_HN = 'ibkhn',
  INDOVINA_BANK = 'indovinabank',
  KASIKORN_BANK = 'kasikorn',
  KIENLONG_BANK = 'kienlongbank',
  KOOKMIN_BANK_HCM = 'kookminhcm',
  KOOKMIN_BANK_HN = 'kookminhn',
  LIENVIETPOST_BANK = 'lienvietpostbank',
  MBBANK = 'mbbank',
  MSB = 'msb',
  NAM_A_BANK = 'namabank',
  NCB = 'ncb',
  NONGHYUP_BANK_HN = 'nonghyup',
  OCB = 'ocb',
  OCEANBANK = 'oceanbank',
  PGBANK = 'pgbank',
  PUBLIC_BANK = 'publicbank',
  PVCOM_BANK = 'pvcombank',
  SACOMBANK = 'sacombank',
  SAIGONBANK = 'saigonbank',
  SCB = 'scb',
  SEA_BANK = 'seabank',
  SHB = 'shb',
  SHINHAN_BANK = 'shinhanbank',
  STANDARD_CHARTERED_BANK = 'standardcharteredbank',
  TECHCOMBANK = 'techcombank',
  TIMO = 'timo',
  TPBANK = 'tpbank',
  UBANK = 'ubank',
  UNITED_OVERSEAS_BANK = 'uob',
  VIB = 'vib',
  VIET_A_BANK = 'vietabank',
  VIET_BANK = 'vietbank',
  VIETCAPITAL_BANK = 'banviet',
  VIETCOMBANK = 'vietcombank',
  VIETINBANK = 'vietinbank',
  VPBANK = 'vpbank',
  VRB = 'vrb',
  WOORI_BANK = 'wooribank',
}

export enum BankCode {
  ABBANK = 'ABB',
  ACB = 'ACB',
  AGRIBANK = 'AGRIBANK',
  BAC_A_BANK = 'BAB',
  BAOVIET_BANK = 'BAOVIETBANK',
  BIDC = 'BIDC',
  BIDV = 'BID',
  CAKE = 'CAKE',
  CBBANK = 'VNCB',
  CIMB = 'CIMB',
  COOP_BANK = 'COOPBANK',
  DBS_BANK = 'DBS',
  DONG_A_BANK = 'DONGABANK',
  EXIMBANK = 'EIB',
  GPBANK = 'GPBANK',
  HDBANK = 'HDB',
  HONGLEONG_BANK = 'HLB',
  HSBC = 'HSBC',
  IBK_HCM = 'IBKHCM',
  IBK_HN = 'IBKHN',
  INDOVINA_BANK = 'IVB',
  KASIKORN_BANK = 'KBANK',
  KIENLONG_BANK = 'KLB',
  KOOKMIN_BANK_HCM = 'KBHCM',
  KOOKMIN_BANK_HN = 'KBHN',
  LIENVIETPOST_BANK = 'LPB',
  MBBANK = 'MBB',
  MSB = 'MSB',
  NAM_A_BANK = 'NAB',
  NCB = 'NVB',
  NONGHYUP_BANK_HN = 'NONGHYUP',
  OCB = 'OCB',
  OCEANBANK = 'OCEANBANK',
  PGBANK = 'PGB',
  PUBLIC_BANK = 'PBVN',
  PVCOM_BANK = 'PVCOMBANK',
  SACOMBANK = 'STB',
  SAIGONBANK = 'SGB',
  SCB = 'SCB',
  SEA_BANK = 'SSB',
  SHB = 'SHB',
  SHINHAN_BANK = 'SVB',
  STANDARD_CHARTERED_BANK = 'SC',
  TECHCOMBANK = 'TCB',
  TIMO = 'TIMO',
  TPBANK = 'TPB',
  UBANK = 'UBANK',
  UNITED_OVERSEAS_BANK = 'UOB',
  VIB = 'VIB',
  VIET_A_BANK = 'VAB',
  VIET_BANK = 'VBB',
  VIETCAPITAL_BANK = 'BVB',
  VIETCOMBANK = 'VCB',
  VIETINBANK = 'CTG',
  VPBANK = 'VPB',
  VRB = 'VRB',
  WOORI_BANK = 'WRB',
}

export enum VietQRStatus {
  NOT_SUPPORTED = -1,
  RECEIVE_ONLY = 0,
  TRANSFER_SUPPORTED = 1,
}

export const banksObject: Record<BankKey, Bank> = {
  [BankKey.ABBANK]: {
    key: BankKey.ABBANK,
    code: BankCode.ABBANK,
    name: 'Ngân hàng TMCP An Bình',
    bin: '970425',
    shortName: 'AB Bank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'ABBKVNVX',
    keywords: 'anbinh',
  },
  [BankKey.ACB]: {
    key: BankKey.ACB,
    code: BankCode.ACB,
    name: 'Ngân hàng TMCP Á Châu',
    bin: '970416',
    shortName: 'ACB',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'ASCBVNVX',
    keywords: 'achau',
    prefixNumber: ['20', '24', '25'],
  },
  [BankKey.AGRIBANK]: {
    key: BankKey.AGRIBANK,
    code: BankCode.AGRIBANK,
    name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam',
    bin: '970405',
    shortName: 'Agribank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'VBAAVNVX',
    keywords: 'nongnghiep, nongthon, agribank, agri',
    prefixNumber: ['150', '340', '130', '490', '290', '361'],
  },
  [BankKey.BAC_A_BANK]: {
    key: BankKey.BAC_A_BANK,
    code: BankCode.BAC_A_BANK,
    name: 'Ngân hàng TMCP Bắc Á',
    bin: '970409',
    shortName: 'BacA Bank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'NASCVNVX',
    keywords: 'baca, NASB',
  },
  [BankKey.BAOVIET_BANK]: {
    key: BankKey.BAOVIET_BANK,
    code: BankCode.BAOVIET_BANK,
    name: 'Ngân hàng TMCP Bảo Việt',
    bin: '970438',
    shortName: 'BaoViet Bank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'BVBVVNVX',
    keywords: 'baoviet, BVB',
  },
  [BankKey.BIDC]: {
    key: BankKey.BIDC,
    code: BankCode.BIDC,
    name: 'Ngân hàng TMCP Đầu tư và Phát triển Campuchia',
    bin: '',
    shortName: 'BIDC',
    vietQRStatus: VietQRStatus.NOT_SUPPORTED,
  },
  [BankKey.BIDV]: {
    key: BankKey.BIDV,
    code: BankCode.BIDV,
    name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
    bin: '970418',
    shortName: 'BIDV',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'BIDVVNVX',
    keywords: 'bidv',
    prefixNumber: ['581', '125', '601', '213'],
  },
  [BankKey.CAKE]: {
    key: BankKey.CAKE,
    code: BankCode.CAKE,
    name: 'Ngân hàng số CAKE by VPBank - Ngân hàng TMCP Việt Nam Thịnh Vượng',
    bin: '546034',
    shortName: 'CAKE by VPBank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: null,
  },
  [BankKey.CBBANK]: {
    key: BankKey.CBBANK,
    code: BankCode.CBBANK,
    name: 'Ngân hàng Thương mại TNHH MTV Xây dựng Việt Nam',
    bin: '970444',
    shortName: 'CB Bank',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 1,
    swiftCode: 'GTBAVNVX',
    keywords: 'xaydungvn, xaydung',
  },
  [BankKey.CIMB]: {
    key: BankKey.CIMB,
    code: BankCode.CIMB,
    name: 'Ngân hàng TNHH MTV CIMB Việt Nam',
    bin: '422589',
    shortName: 'CIMB Bank',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 1,
    swiftCode: 'CIBBVNVN',
    keywords: 'cimbvn',
  },
  [BankKey.COOP_BANK]: {
    key: BankKey.COOP_BANK,
    code: BankCode.COOP_BANK,
    name: 'Ngân hàng Hợp tác xã Việt Nam',
    bin: '970446',
    shortName: 'Co-op Bank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: null,
    keywords: 'hoptacxa, coop',
  },
  [BankKey.DBS_BANK]: {
    key: BankKey.DBS_BANK,
    code: BankCode.DBS_BANK,
    name: 'NH TNHH MTV Phát triển Singapore - Chi nhánh TP. Hồ Chí Minh',
    bin: '796500',
    shortName: 'DBS Bank',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 0,
    swiftCode: 'DBSSVNVX',
    keywords: 'dbshcm',
  },
  [BankKey.DONG_A_BANK]: {
    key: BankKey.DONG_A_BANK,
    code: BankCode.DONG_A_BANK,
    name: 'Ngân hàng TMCP Đông Á',
    bin: '970406',
    shortName: 'DongA Bank',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 1,
    swiftCode: 'EACBVNVX',
    keywords: 'donga, DAB',
    prefixNumber: ['0044'],
  },
  [BankKey.EXIMBANK]: {
    key: BankKey.EXIMBANK,
    code: BankCode.EXIMBANK,
    name: 'Ngân hàng TMCP Xuất Nhập khẩu Việt Nam',
    bin: '970431',
    shortName: 'Eximbank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'EBVIVNVX',
  },
  [BankKey.GPBANK]: {
    key: BankKey.GPBANK,
    code: BankCode.GPBANK,
    name: 'Ngân hàng Thương mại TNHH MTV Dầu Khí Toàn Cầu',
    bin: '970408',
    shortName: 'GPBank',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 1,
    swiftCode: 'GBNKVNVX',
    keywords: 'daukhi',
  },
  [BankKey.HDBANK]: {
    key: BankKey.HDBANK,
    code: BankCode.HDBANK,
    name: 'Ngân hàng TMCP Phát triển TP. Hồ Chí Minh',
    bin: '970437',
    shortName: 'HDBank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'HDBCVNVX',
  },
  [BankKey.HONGLEONG_BANK]: {
    key: BankKey.HONGLEONG_BANK,
    code: BankCode.HONGLEONG_BANK,
    name: 'Ngân hàng TNHH MTV Hong Leong Việt Nam',
    bin: '970442',
    shortName: 'HongLeong Bank',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 1,
    swiftCode: 'HLBBVNVX',
    keywords: 'HLBVN',
  },
  [BankKey.HSBC]: {
    key: BankKey.HSBC,
    code: BankCode.HSBC,
    name: 'Ngân hàng TNHH MTV HSBC (Việt Nam)',
    bin: '458761',
    shortName: 'HSBC Vietnam',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 1,
    swiftCode: 'HSBCVNVX',
  },
  [BankKey.IBK_HCM]: {
    key: BankKey.IBK_HCM,
    code: BankCode.IBK_HCM,
    name: 'Ngân hàng Công nghiệp Hàn Quốc - Chi nhánh TP. Hồ Chí Minh',
    bin: '970456',
    shortName: 'IBK HCM',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 0,
    swiftCode: null,
    keywords: 'congnghiep',
  },
  [BankKey.IBK_HN]: {
    key: BankKey.IBK_HN,
    code: BankCode.IBK_HN,
    name: 'Ngân hàng Công nghiệp Hàn Quốc - Chi nhánh Hà Nội',
    bin: '970455',
    shortName: 'IBK HN',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 0,
    swiftCode: null,
    keywords: 'congnghiep',
  },
  [BankKey.INDOVINA_BANK]: {
    key: BankKey.INDOVINA_BANK,
    code: BankCode.INDOVINA_BANK,
    name: 'Ngân hàng TNHH Indovina',
    bin: '970434',
    shortName: 'Indovina Bank',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 1,
    swiftCode: null,
  },
  [BankKey.KASIKORN_BANK]: {
    key: BankKey.KASIKORN_BANK,
    code: BankCode.KASIKORN_BANK,
    name: 'Ngân hàng Đại chúng TNHH KASIKORNBANK - CN TP. Hồ Chí Minh',
    bin: '668888',
    shortName: 'Kasikornbank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'KASIVNVX',
  },
  [BankKey.KIENLONG_BANK]: {
    key: BankKey.KIENLONG_BANK,
    code: BankCode.KIENLONG_BANK,
    name: 'Ngân hàng TMCP Kiên Long',
    bin: '970452',
    shortName: 'KienlongBank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'KLBKVNVX',
  },
  [BankKey.KOOKMIN_BANK_HCM]: {
    key: BankKey.KOOKMIN_BANK_HCM,
    code: BankCode.KOOKMIN_BANK_HCM,
    name: 'Ngân hàng Kookmin - Chi nhánh TP. Hồ Chí Minh',
    bin: '970463',
    shortName: 'Kookmin Bank HCM',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 0,
    swiftCode: null,
  },
  [BankKey.KOOKMIN_BANK_HN]: {
    key: BankKey.KOOKMIN_BANK_HN,
    code: BankCode.KOOKMIN_BANK_HN,
    name: 'Ngân hàng Kookmin - Chi nhánh Hà Nội',
    bin: '970462',
    shortName: 'Kookmin Bank HN',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 0,
    swiftCode: null,
  },
  [BankKey.LIENVIETPOST_BANK]: {
    key: BankKey.LIENVIETPOST_BANK,
    code: BankCode.LIENVIETPOST_BANK,
    name: 'Ngân hàng TMCP Bưu Điện Liên Việt',
    bin: '970449',
    shortName: 'LienVietPostBank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'LVBKVNVX',
    keywords: 'lienvietbank',
    prefixNumber: ['000'],
  },
  [BankKey.MBBANK]: {
    key: BankKey.MBBANK,
    code: BankCode.MBBANK,
    name: 'Ngân hàng TMCP Quân đội',
    bin: '970422',
    shortName: 'MB Bank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'MSCBVNVX',
    prefixNumber: [
      '068',
      '0801',
      '0050',
      '821',
      '065',
      '1800',
      '600',
      '011',
      '0600',
    ],
  },
  [BankKey.MSB]: {
    key: BankKey.MSB,
    code: BankCode.MSB,
    name: 'Ngân hàng TMCP Hàng Hải',
    bin: '970426',
    shortName: 'MSB',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'MCOBVNVX',
    keywords: 'hanghai',
    prefixNumber: ['35'],
  },
  [BankKey.NAM_A_BANK]: {
    key: BankKey.NAM_A_BANK,
    code: BankCode.NAM_A_BANK,
    name: 'Ngân hàng TMCP Nam Á',
    bin: '970428',
    shortName: 'Nam A Bank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'NAMAVNVX',
    keywords: 'namabank',
  },
  [BankKey.NCB]: {
    key: BankKey.NCB,
    code: BankCode.NCB,
    name: 'Ngân hàng TMCP Quốc Dân',
    bin: '970419',
    shortName: 'NCB Bank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'NVBAVNVX',
    keywords: 'quocdan',
  },
  [BankKey.NONGHYUP_BANK_HN]: {
    key: BankKey.NONGHYUP_BANK_HN,
    code: BankCode.NONGHYUP_BANK_HN,
    name: 'Ngân hàng Nonghyup - Chi nhánh Hà Nội',
    bin: '801011',
    shortName: 'Nonghyup Bank',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 0,
    swiftCode: null,
  },
  [BankKey.OCB]: {
    key: BankKey.OCB,
    code: BankCode.OCB,
    name: 'Ngân hàng TMCP Phương Đông',
    bin: '970448',
    shortName: 'OCB Bank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'ORCOVNVX',
    keywords: 'phuongdong',
  },
  [BankKey.OCEANBANK]: {
    key: BankKey.OCEANBANK,
    code: BankCode.OCEANBANK,
    name: 'Ngân hàng Thương mại TNHH MTV Đại Dương',
    bin: '970414',
    shortName: 'Ocean Bank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'OCBKUS3M',
    keywords: 'daiduong',
  },
  [BankKey.PGBANK]: {
    key: BankKey.PGBANK,
    code: BankCode.PGBANK,
    name: 'Ngân hàng TMCP Xăng dầu Petrolimex',
    bin: '970430',
    shortName: 'PG Bank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'PGBLVNVX',
  },
  [BankKey.PUBLIC_BANK]: {
    key: BankKey.PUBLIC_BANK,
    code: BankCode.PUBLIC_BANK,
    name: 'Ngân hàng TNHH MTV Public Việt Nam',
    bin: '970439',
    shortName: 'Public Bank Vietnam',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 1,
    swiftCode: 'VIDPVNVX',
    keywords: 'publicvn',
  },
  [BankKey.PVCOM_BANK]: {
    key: BankKey.PVCOM_BANK,
    code: BankCode.PVCOM_BANK,
    name: 'Ngân hàng TMCP Đại Chúng Việt Nam',
    bin: '970412',
    shortName: 'PVcomBank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'WBVNVNVX',
    keywords: 'daichung',
  },
  [BankKey.SACOMBANK]: {
    key: BankKey.SACOMBANK,
    code: BankCode.SACOMBANK,
    name: 'Ngân hàng TMCP Sài Gòn Thương Tín',
    bin: '970403',
    shortName: 'Sacombank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'SGTTVNVX',
    prefixNumber: ['020', '5611', '0400', '1234', '030', '0602'],
  },
  [BankKey.SAIGONBANK]: {
    key: BankKey.SAIGONBANK,
    code: BankCode.SAIGONBANK,
    name: 'Ngân hàng TMCP Sài Gòn Công Thương',
    bin: '970400',
    shortName: 'SaigonBank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'SBITVNVX',
    keywords: 'saigoncongthuong, saigonbank',
  },
  [BankKey.SCB]: {
    key: BankKey.SCB,
    code: BankCode.SCB,
    name: 'Ngân hàng TMCP Sài Gòn',
    bin: '970429',
    shortName: 'SCB',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'SACLVNVX',
    keywords: 'saigon',
  },
  [BankKey.SEA_BANK]: {
    key: BankKey.SEA_BANK,
    code: BankCode.SEA_BANK,
    name: 'Ngân hàng TMCP Đông Nam Á',
    bin: '970440',
    shortName: 'SeABank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'SEAVVNVX',
  },
  [BankKey.SHB]: {
    key: BankKey.SHB,
    code: BankCode.SHB,
    name: 'Ngân hàng TMCP Sài Gòn - Hà Nội',
    bin: '970443',
    shortName: 'SHB',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'SHBAVNVX',
    keywords: 'saigonhanoi, sghn',
  },
  [BankKey.SHINHAN_BANK]: {
    key: BankKey.SHINHAN_BANK,
    code: BankCode.SHINHAN_BANK,
    name: 'Ngân hàng TNHH MTV Shinhan Việt Nam',
    bin: '970424',
    shortName: 'Shinhan Bank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'SHBKVNVX',
  },
  [BankKey.STANDARD_CHARTERED_BANK]: {
    key: BankKey.STANDARD_CHARTERED_BANK,
    code: BankCode.STANDARD_CHARTERED_BANK,
    name: 'Ngân hàng TNHH MTV Standard Chartered Bank Việt Nam',
    bin: '970410',
    shortName: 'Standard Chartered Vietnam',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 1,
    swiftCode: 'SCBLVNVX',
  },
  [BankKey.TECHCOMBANK]: {
    key: BankKey.TECHCOMBANK,
    code: BankCode.TECHCOMBANK,
    name: 'Ngân hàng TMCP Kỹ thương Việt Nam',
    bin: '970407',
    shortName: 'Techcombank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'VTCBVNVX',
    prefixNumber: ['102', '196', '140', '191', '190'],
  },
  [BankKey.TIMO]: {
    key: BankKey.TIMO,
    code: BankCode.TIMO,
    name: 'Ngân hàng số Timo by Bản Việt Bank',
    bin: '963388',
    shortName: 'Timo',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 0,
    swiftCode: null,
    keywords: 'banviet',
  },
  [BankKey.TPBANK]: {
    key: BankKey.TPBANK,
    code: BankCode.TPBANK,
    name: 'Ngân hàng TMCP Tiên Phong',
    bin: '970423',
    shortName: 'TPBank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'TPBVVNVX',
    keywords: 'tienphong',
    prefixNumber: ['020', '03'],
  },
  [BankKey.UBANK]: {
    key: BankKey.UBANK,
    code: BankCode.UBANK,
    name: 'Ngân hàng số Ubank by VPBank - Ngân hàng TMCP Việt Nam Thịnh Vượng',
    bin: '546035',
    shortName: 'Ubank by VPBank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: null,
  },
  [BankKey.UNITED_OVERSEAS_BANK]: {
    key: BankKey.UNITED_OVERSEAS_BANK,
    code: BankCode.UNITED_OVERSEAS_BANK,
    name: 'Ngân hàng United Overseas Bank Việt Nam',
    bin: '970458',
    shortName: 'United Overseas Bank Vietnam',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 1,
    swiftCode: null,
  },
  [BankKey.VIB]: {
    key: BankKey.VIB,
    code: BankCode.VIB,
    name: 'Ngân hàng TMCP Quốc tế Việt Nam',
    bin: '970441',
    shortName: 'VIB',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'VNIBVNVX',
    keywords: 'quocte',
    prefixNumber: ['025', '601'],
  },
  [BankKey.VIET_A_BANK]: {
    key: BankKey.VIET_A_BANK,
    code: BankCode.VIET_A_BANK,
    name: 'Ngân hàng TMCP Việt Á',
    bin: '970427',
    shortName: 'VietABank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'VNACVNVX',
  },
  [BankKey.VIET_BANK]: {
    key: BankKey.VIET_BANK,
    code: BankCode.VIET_BANK,
    name: 'Ngân hàng TMCP Việt Nam Thương Tín',
    bin: '970433',
    shortName: 'VietBank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'VNTTVNVX',
    keywords: 'vietnamthuongtin, vnthuongtin',
  },
  [BankKey.VIETCAPITAL_BANK]: {
    key: BankKey.VIETCAPITAL_BANK,
    code: BankCode.VIETCAPITAL_BANK,
    name: 'Ngân hàng TMCP Bản Việt',
    bin: '970454',
    shortName: 'Viet Capital Bank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'VCBCVNVX',
    keywords: 'banviet',
    prefixNumber: ['068', '001', '030', '009', '008', '015', '801'],
  },
  [BankKey.VIETCOMBANK]: {
    key: BankKey.VIETCOMBANK,
    code: BankCode.VIETCOMBANK,
    name: 'Ngân hàng TMCP Ngoại Thương Việt Nam',
    bin: '970436',
    shortName: 'Vietcombank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'BFTVVNVX',
    prefixNumber: [
      '001',
      '014',
      '002',
      '022',
      '004',
      '049',
      '030',
      '045',
      '097',
      '082',
      '007',
      '056',
      '054',
      '085',
    ],
  },
  [BankKey.VIETINBANK]: {
    key: BankKey.VIETINBANK,
    code: BankCode.VIETINBANK,
    name: 'Ngân hàng TMCP Công thương Việt Nam',
    bin: '970415',
    shortName: 'VietinBank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'ICBVVNVX',
    keywords: 'viettin', // Some users may use this keyword
    prefixNumber: ['1000', '71', '0988', '0909'],
  },
  [BankKey.VPBANK]: {
    key: BankKey.VPBANK,
    code: BankCode.VPBANK,
    name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng',
    bin: '970432',
    shortName: 'VPBank',
    vietQRStatus: VietQRStatus.TRANSFER_SUPPORTED,
    lookupSupported: 1,
    swiftCode: 'VPBKVNVX',
    keywords: 'vnthinhvuong',
    prefixNumber: [
      '21',
      '79',
      '82',
      '69',
      '87',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
    ],
  },
  [BankKey.VRB]: {
    key: BankKey.VRB,
    code: BankCode.VRB,
    name: 'Ngân hàng Liên doanh Việt - Nga',
    bin: '970421',
    shortName: 'VietNgaBank',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 1,
    swiftCode: null,
    keywords: 'vietnam-russia, vrbank',
  },
  [BankKey.WOORI_BANK]: {
    key: BankKey.WOORI_BANK,
    code: BankCode.WOORI_BANK,
    name: 'Ngân hàng TNHH MTV Woori Việt Nam',
    bin: '970457',
    shortName: 'Woori Bank',
    vietQRStatus: VietQRStatus.RECEIVE_ONLY,
    lookupSupported: 1,
    swiftCode: null,
  },
};

export const banks: Bank[] = Object.values(banksObject);
