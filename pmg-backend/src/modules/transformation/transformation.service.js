const xml2js = require('xml2js');
const fs = require('fs');
const logger = require('../../shared/logger.service');
class TransformationService {
  constructor() {
    this.parser = new xml2js.Parser({ explicitArray: false });
    this.builder = new xml2js.Builder();
  }

  /**
   * Transform a message from one format to another.
   * @param {string} filePath - Path to the input file.
   * @param {string} sourceFormat - Source format (e.g., MT, MX).
   * @param {string} targetFormat - Target format (e.g., MX, Raast).
   * @returns {Promise<string>} - Transformed message.
   */
  async transformMessage(filePath, sourceFormat, targetFormat) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');

      if (sourceFormat === 'MT' && targetFormat === 'MX') {
        return this.mtToMx(fileContent);
      } else if (sourceFormat === 'MX' && targetFormat === 'Raast') {
        return this.mxToRaast(fileContent);
      } else {
        throw new Error(`Unsupported transformation: ${sourceFormat} → ${targetFormat}`);
      }
    } catch (error) {
      logger.error(`Error transforming message: ${error.message}`);
      throw error;
    }
  }

  /**
   * Transform SWIFT MT to SWIFT MX (ISO 20022).
   * @param {string} mtMessage - SWIFT MT message content.
   * @returns {Promise<string>} - Transformed SWIFT MX message.
   */
  async mtToMx(mtMessage) {
    console.log('Transforming MT to MX...');
    const mxMessage = {
      Document: {
        FIToFICstmrCdtTrf: {
          GrpHdr: {
            MsgId: '123456789',
            CreDtTm: new Date().toISOString(),
          },
          CdtTrfTxInf: {
            PmtId: {
              InstrId: 'MT-InstrId',
              EndToEndId: 'MT-EndToEndId',
            },
            Amt: {
              InstdAmt: {
                _: '50000.00', // Amount
                Ccy: 'PKR',    // Currency
              },
            },
            Cdtr: {
              Nm: 'Beneficiary Name',
            },
          },
        },
      },
    };
  

    return this.builder.buildObject(mxMessage);
  }

  /**
   * Transform SWIFT MX (ISO 20022) to Raast JSON.
   * @param {string} mxMessage - SWIFT MX message content.
   * @returns {Promise<string>} - Transformed Raast JSON message.
   */
  async mxToRaast(mxMessage) {
    logger.info('Transforming MX to Raast...');
    const parsedMessage = await this.parser.parseStringPromise(mxMessage);

    // Example: Map MX fields to Raast JSON fields
    const raastMessage = {
      transactionId: parsedMessage.Document.FIToFICstmrCdtTrf.GrpHdr.MsgId,
      amount: parsedMessage.Document.FIToFICstmrCdtTrf.CdtTrfTxInf.Amt.InstdAmt._,
      currency: parsedMessage.Document.FIToFICstmrCdtTrf.CdtTrfTxInf.Amt.InstdAmt.Ccy,
      beneficiary: parsedMessage.Document.FIToFICstmrCdtTrf.CdtTrfTxInf.Cdtr.Nm,
    };

    return JSON.stringify(raastMessage, null, 2);
  }
}

module.exports = new TransformationService();