import prisma from "../../db/index.js";
import { responseMessage } from "../../constants/index.js";

export const settingController = {
  getBankDetail: async (req, res) => {
    const keysToFetch = ["bank_name", "account_number", "account_holder"];

    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: keysToFetch,
        },
      },
    });

    const bankDetails = settings.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    return res.status(200).json({
      message: responseMessage.SUCCESS_FETCH,
      data: {
        bank_name: bankDetails["bank_name"],
        account_number: bankDetails["account_number"],
        account_holder: bankDetails["account_holder"],
      },
    });
  },
  updateBankDetail: async (req, res) => {
    const { bank_name, account_number, account_holder } = req.body;

    const updates = [
      { key: "bank_name", value: bank_name },
      { key: "account_number", value: account_number },
      { key: "account_holder", value: account_holder },
    ];

    await prisma.$transaction(
      updates.map((item) =>
        prisma.setting.update({
          where: {
            key: item.key,
          },
          data: {
            value: item.value,
          },
        })
      )
    );

    return res.status(200).json({
      message: responseMessage.SUCCESS_UPDATE,
    });
  },
};
