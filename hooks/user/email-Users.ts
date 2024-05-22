"use server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const createEmails = async (emails: string[], listing: any) => {
  emails.map(async (email: string) => {
    const emailParams = {
      Destination: {
        ToAddresses: [email || "shortzach396@gmail.com"],
      },
      Message: {
        Body: {
          Html: {
            Data: ` 
          <div style="width: 100%; display: flex; justify-content: center; font-family: 'Outfit', sans-serif; color: white; box-sizing: border-box;">
          <div style="display: flex; flex-direction: column; background-color: #ced9bb; padding: 16px; border-radius: 8px; width: 100%; max-width: 320px; box-sizing: border-box;">
           
            <div style="text-align: center;">
              <p>${listing.title} are now back in stock! Click the link to go check it out.</p>
              <a href="https://ezhomesteading.com/listing/${listing.id}" style="display: inline-block; text-decoration: none; margin-top: 8px; padding: 8px 16px; background-color: #4CAF50; color: white; border-radius: 4px;">
                LINK
              </a>
            </div>
          </div>
        </div>
            `,
          },
        },
        Subject: {
          Data: "Item Back in Stock",
        },
      },
      Source: "support@ezhomesteading.com",
    };

    try {
      await sesClient.send(new SendEmailCommand(emailParams));
      console.log("Email sent to the seller");
    } catch (error) {
      console.error("Error sending email to the seller:", error);
    }
  });
};
