import React from "react";
import { DownloaderProps, DownloaderState } from "./interface";
import { downloadElectronicBook } from "../../services/ebook";
import Book from "../../models/Book";
import DatabaseService from "../../utils/storage/databaseService";
import BookUtil from "../../utils/file/bookUtil";
import {
  ConfigService,
  BookHelper,
} from "../../assets/lib/kookit-extra-browser.min";
import * as Kookit from "../../assets/lib/kookit.min";
import SparkMD5 from "spark-md5";

function detectFormat(filename?: string, contentType?: string): string {
  const name = (filename || "").toLowerCase();
  if (name.endsWith(".epub") || contentType === "application/epub+zip")
    return "EPUB";
  if (name.endsWith(".pdf") || contentType === "application/pdf") return "PDF";
  if (
    name.endsWith(".mobi") ||
    contentType === "application/x-mobipocket-ebook"
  )
    return "MOBI";
  if (name.endsWith(".azw3")) return "AZW3";
  if (name.endsWith(".azw")) return "AZW";
  if (name.endsWith(".txt") || contentType?.startsWith("text/")) return "TXT";
  if (name.endsWith(".md")) return "MD";
  if (name.endsWith(".fb2")) return "FB2";
  if (name.endsWith(".html") || name.endsWith(".htm")) return "HTML";
  return "EPUB";
}

function detectCharset(contentType?: string): string {
  if (!contentType) return "utf-8";
  const m = contentType.match(/charset=([^;\s]+)/i);
  const cs = m?.[1]?.trim();
  return cs && cs.length > 0 ? cs : "utf-8";
}

export default class Downloader extends React.Component<
  DownloaderProps,
  DownloaderState
> {
  private _isMounted: boolean = false;
  constructor(props: DownloaderProps) {
    super(props);
    this.state = { status: "idle" };
  }
  async componentDidMount() {
    this._isMounted = true;
    const electronicBookId = this.props.match.params?.electronicBookId;
    if (!electronicBookId) {
      this.setState({ status: "error", message: "Missing electronicBookId" });
      return;
    }
    try {
      const existingRecord = await DatabaseService.getRecord(
        electronicBookId,
        "books"
      );
      if (existingRecord) {
        const existingFormatLower = existingRecord.format.toLowerCase();
        const alreadyExists = await BookUtil.isBookExist(
          electronicBookId,
          existingFormatLower,
          existingRecord.path
        );
        console.log(alreadyExists);
        if (alreadyExists) {
          if (this._isMounted) {
            ConfigService.setReaderConfig("isDownloading", "no");
            this.props.history.replace({
              pathname: `/${existingFormatLower}/${electronicBookId}`,
              search: `?title=${encodeURIComponent(
                existingRecord.name
              )}&file=${encodeURIComponent(electronicBookId)}`,
            });
          }
          return;
        }
      }

      this.setState({ status: "loading" });
      ConfigService.setReaderConfig("isDownloading", "yes");
      const { buffer, filename, contentType } = await downloadElectronicBook(
        electronicBookId
      );

      if (!buffer || buffer.byteLength === 0) {
        throw new Error("下载结果为空");
      }
      const formatLower = detectFormat(filename, contentType).toLowerCase();
      const charset = detectCharset(contentType);

      const bookName = filename
        ? filename.toLowerCase().endsWith(`.${formatLower}`)
          ? filename.slice(0, filename.length - formatLower.length - 1)
          : filename
        : `${electronicBookId}.${formatLower}`;
      console.log(bookName, charset);

      await BookUtil.addBook(electronicBookId, formatLower, buffer);
      const exists = await BookUtil.isBookExist(
        electronicBookId,
        formatLower,
        ""
      );
      if (!exists) {
        throw new Error("文件保存失败");
      }

      const md5 = SparkMD5.ArrayBuffer.hash(buffer);
      const rendition = BookHelper.getRendition(
        buffer,
        {
          format: formatLower.toUpperCase(),
          readerMode: "",
          charset: "",
          animation:
            ConfigService.getReaderConfig("isSliding") === "yes"
              ? "sliding"
              : "",
          convertChinese: ConfigService.getReaderConfig("convertChinese"),
          parserRegex: "",
          isDarkMode: "no",
          isMobile: "no",
          password: "",
          isScannedPDF: "no",
        },
        Kookit
      );
      let result = await BookHelper.generateBook(
        bookName,
        formatLower,
        md5,
        buffer.byteLength,
        "",
        buffer,
        rendition
      );
      if (ConfigService.getReaderConfig("isUseOriginalName") === "yes") {
        result.name = bookName;
      }
      result.key = electronicBookId;
      result.format = formatLower.toUpperCase();
      result.charset = charset;
      await DatabaseService.saveRecord(result as Book, "books");

      if (this._isMounted) {
        ConfigService.setReaderConfig("isDownloading", "no");
        this.props.history.replace({
          pathname: `/${formatLower}/${electronicBookId}`,
          search: `?title=${encodeURIComponent(
            result.name
          )}&file=${encodeURIComponent(electronicBookId)}`,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.setState({ status: "error", message });
      ConfigService.setReaderConfig("isDownloading", "no");
    }
  }
  componentWillUnmount(): void {
    this._isMounted = false;
  }
  render() {
    const isLoading = this.state.status === "loading";
    const isError = this.state.status === "error";
    return (
      <div
        style={{
          padding: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "40vh",
        }}
      >
        {isLoading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
            aria-busy="true"
            aria-live="polite"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 50 50"
              role="img"
              aria-label="Loading"
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                stroke="#999"
                strokeWidth="5"
                fill="none"
                opacity="0.2"
              />
              <circle
                cx="25"
                cy="25"
                r="20"
                stroke="#3b82f6"
                strokeWidth="5"
                fill="none"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 25 25"
                  to="360 25 25"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
            <div style={{ color: "#666" }}>正在下载电子书文件流，请稍候…</div>
          </div>
        )}
        {isError && (
          <div style={{ color: "#b91c1c" }}>{this.state.message}</div>
        )}
      </div>
    );
  }
}
