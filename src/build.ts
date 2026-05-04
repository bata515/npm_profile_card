#!/usr/bin/env node
// 👆 Used to tell Node.js that this is a CLI tool

import chalk from "chalk";
import boxen, { Options, BorderStyle } from "boxen";
import { readFileSync, writeFileSync, chmodSync } from "fs";
import { join } from "path";
import qrcode from "qrcode-terminal";

// Define options for Boxen
const options: Options = {
  padding: 1,
  margin: 1,
  borderStyle: BorderStyle.Round,
  borderColor: "white",
};

const catArt = `
          ) ) ) ) ) )
         ( ( ( ( ( (
      _________________
     |                 |\\
     |    I  ♥         | |
     |    Coffee!      | |
     |                 |/
      \\               /
       \\_____________/
`;

// アニメーション用の関数
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// コンソールをクリアする関数
const clearConsole = (): void => {
  process.stdout.write("\x1Bc");
};

// 文字列を行に分割
const splitIntoLines = (text: string): string[] => {
  return text.split("\n");
};

// ボックスを描画する関数
const drawBox = (content: string, borderColor = "white"): string => {
  return boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: BorderStyle.Round,
    borderColor: borderColor,
  });
};

// カラーコードを生成
const generateColors = (count: number): string[] => {
  const colors: string[] = [];
  for (let i = 1; i <= count; i++) {
    // 単純な色の配列を使用
    const baseColors = [
      "green",
      "yellow",
      "blue",
      "magenta",
      "cyan",
      "white",
      "red",
    ];
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
};

// 最大行長を計算（事前計算用）
const calculateMaxLineLength = (lines: string[]): number => {
  let maxLength = 0;
  for (const line of lines) {
    if (line.length > maxLength) {
      maxLength = line.length;
    }
  }
  return maxLength;
};

// メイン関数
async function main(): Promise<void> {
  try {
    // 出力内容を直接使用
    const outputContent = output;

    // コンソールをクリア
    clearConsole();

    // 出力内容を行に分割
    const lines = splitIntoLines(outputContent);

    // 最大行長を計算（事前計算）
    const maxLineLength = calculateMaxLineLength(lines);

    // 枠のサイズを固定するために、最初に空の枠を表示
    const emptyBox = drawBox(" ".repeat(maxLineLength));
    clearConsole();
    console.log(emptyBox);
    await sleep(100);

    // アニメーション表示用の変数
    let currentContent = "";
    let displayContent = "";

    // 1文字ずつ表示（簡略化）
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 空行はそのまま追加
      if (line.trim() === "") {
        currentContent += line + "\n";
        displayContent = currentContent;
        clearConsole();
        console.log(drawBox(displayContent));
        await sleep(50);
        continue;
      }

      // 1文字ずつ追加
      for (let j = 0; j < line.length; j++) {
        currentContent += line[j];
        displayContent = currentContent;
        clearConsole();
        console.log(drawBox(displayContent));
        await sleep(10); // 速度を上げる
      }

      // 行の終わりに改行を追加
      currentContent += "\n";
      displayContent = currentContent;
      clearConsole();
      console.log(drawBox(displayContent));
      await sleep(50); // 行の終わりで少し待機
    }

    // QRコードを生成
    const generateQRCode = (): Promise<string> => {
      return new Promise((resolve) => {
        let qrString = "";
        // qrcode-terminalの出力をキャプチャするためのカスタム関数
        qrcode.generate(
          "https://batannu-profile-web.vercel.app/",
          { small: true },
          (qr) => {
            qrString = qr;
            resolve(qrString);
          }
        );
      });
    };

    // QRコードを取得
    const qrCodeString = await generateQRCode();
    const qrCodeLines = qrCodeString.split("\n");

    // コーヒーカップアートとQRコードを横に並べる
    const coffeeLines = catArt.split("\n");

    // 2つのアートの最大行数を取得
    const maxLines = Math.max(coffeeLines.length, qrCodeLines.length);

    // レインボーカラーの配列
    const rainbowColors = [
      chalk.red,
      chalk.yellow,
      chalk.green,
      chalk.cyan,
      chalk.blue,
      chalk.magenta,
    ];

    // QRコードとコーヒーカップの間のスペース
    const padding = 5;

    // 結合したアートを表示（レインボー）
    clearConsole();
    console.log(drawBox(displayContent));
    for (let lineIndex = 0; lineIndex < maxLines; lineIndex++) {
      const coffeeLine = lineIndex < coffeeLines.length ? coffeeLines[lineIndex] : "";
      const qrLine = lineIndex < qrCodeLines.length ? qrCodeLines[lineIndex] : "";
      const colorIndex = lineIndex % rainbowColors.length;
      console.log(qrLine + " ".repeat(padding) + rainbowColors[colorIndex](coffeeLine));
    }
    await sleep(300);

    // ボーダーとコーヒーカップの色を変化させる（レインボーアニメーション）
    const borderColors = [
      "green",
      "yellow",
      "blue",
      "magenta",
      "cyan",
      "red",
      "white",
    ];
    for (let i = 0; i < 30; i++) {
      const borderColor = borderColors[i % borderColors.length];
      clearConsole();
      console.log(drawBox(displayContent, borderColor));

      // レインボー効果を各行に適用（アニメーション）
      for (let lineIndex = 0; lineIndex < maxLines; lineIndex++) {
        const coffeeLine = lineIndex < coffeeLines.length ? coffeeLines[lineIndex] : "";
        const qrLine = lineIndex < qrCodeLines.length ? qrCodeLines[lineIndex] : "";
        // 各フレームで色をシフト
        const colorIndex = (lineIndex + i) % rainbowColors.length;
        console.log(qrLine + " ".repeat(padding) + rainbowColors[colorIndex](coffeeLine));
      }
      await sleep(100);
    }

    // 最終的な表示（レインボー）
    clearConsole();
    console.log(drawBox(displayContent, "green"));
    for (let lineIndex = 0; lineIndex < maxLines; lineIndex++) {
      const coffeeLine = lineIndex < coffeeLines.length ? coffeeLines[lineIndex] : "";
      const qrLine = lineIndex < qrCodeLines.length ? qrCodeLines[lineIndex] : "";
      const colorIndex = lineIndex % rainbowColors.length;
      console.log(qrLine + " ".repeat(padding) + rainbowColors[colorIndex](coffeeLine));
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

const data = {
  name: chalk.white("               Ryuki Kawabata"),
  handle: chalk.white("bata515"),
  work:
    chalk.white("Developer") + chalk.cyan("@") + chalk.greenBright("BroadLeaf"),
  twitter: chalk.gray("https://twitter.com/") + chalk.cyan("shiningdoragon"),
  github: chalk.gray("https://github.com/") + chalk.green("bata515"),
  tiktok: chalk.gray("https://www.tiktok.com/@") + chalk.cyan("okoge229"),
  portfolio: chalk.cyan(
    "https://hatiware-ai-chat-484250524840.asia-northeast1.run.app/"
  ),
  blog: chalk.cyan("https://batannu-profile-web.vercel.app/"),
  contact: chalk.cyan("https://batannu-profile-web.vercel.app/"),
  instagram: chalk.gray("TBD") + chalk.magenta(""),
  npx: chalk.red("npx") + " " + chalk.white("bata515"),
  labelWork: chalk.white.bold("       Work:"),
  labelTwitter: chalk.white.bold("    Twitter:"),
  labelGitHub: chalk.white.bold("     GitHub:"),
  labelTiktok: chalk.white.bold("     Tiktok:"),
  labelInstagram: chalk.white.bold("  Instagram:"),
  labelPortfolio: chalk.white.bold("   Contents:"),
  labelBlog: chalk.white.bold("    Profile:"),
  labelContact: chalk.white.bold("    Contact:"),
  labelCard: chalk.white.bold("       Card:"),
};

const newline = "\n";
const heading = `${data.name} / ${data.handle}`;
const working = `${data.labelWork}  ${data.work}`;
const twittering = `${data.labelTwitter}  ${data.twitter}`;
const instagraming = `${data.labelInstagram}  ${data.instagram}`;
const githubing = `${data.labelGitHub}  ${data.github}`;
const tiktoking = `${data.labelTiktok}  ${data.tiktok}`;
const portfolio = `${data.labelPortfolio}  ${data.portfolio}`;
const bloging = `${data.labelBlog}  ${data.blog}`;
const contact = `${data.labelContact}  ${data.contact}`;
const carding = `${data.labelCard}  ${data.npx}`;

const output =
  heading +
  newline +
  newline +
  working +
  newline +
  newline +
  twittering +
  newline +
  tiktoking +
  newline +
  instagraming +
  newline +
  githubing +
  newline +
  portfolio +
  newline +
  bloging +
  newline +
  contact +
  newline +
  newline +
  carding;

// QRコードを生成
const generateQRCodeSync = (): string => {
  let qrString = "";
  // qrcode-terminalの出力をキャプチャするためのカスタム関数
  qrcode.generate(
    "https://batannu-profile-web.vercel.app/",
    { small: true },
    (qr) => {
      qrString = qr;
    }
  );
  return qrString;
};

// 柴犬アートとQRコードを横に並べる関数（QRコードを左、柴犬アートを右に配置）
const combineArt = (shibaArt: string, qrCode: string): string => {
  const shibaLines = shibaArt.split("\n");
  const qrLines = qrCode.split("\n");
  const maxLines = Math.max(shibaLines.length, qrLines.length);
  const combined: string[] = [];

  for (let i = 0; i < maxLines; i++) {
    const shibaLine = i < shibaLines.length ? shibaLines[i] : "";
    const qrLine = i < qrLines.length ? qrLines[i] : "";
    const padding = 5; // QRコードと柴犬アートの間のスペース
    combined.push(qrLine + " ".repeat(padding) + chalk.yellow(shibaLine));
  }

  return combined.join("\n");
};

// 注意: この部分は実際には使用されていないようですが、
// 必要に応じて以下のようにfinalOutputを更新できます
// const qrCode = generateQRCodeSync();
// const finalOutput = chalk.green(boxen(output, options)) + newline + combineArt(catArt, qrCode);
const finalOutput =
  chalk.green(boxen(output, options)) + newline + chalk.yellow(catArt);

// メイン関数を実行
main();

// エクスポート（必要に応じて）
export { main };
