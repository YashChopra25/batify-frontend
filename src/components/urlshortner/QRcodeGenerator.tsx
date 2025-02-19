import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import QRCodeStyling, { Options, FileExtension } from "qr-code-styling";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AxiosError, isAxiosError } from "axios";
import axiosInstance, { ApiResponse } from "@/api/axiosInstance";
import { ApiResponseCreateLink } from "@/Types";
import ToastFn from "../Toaster";

const QRcodeGenerator = () => {
  const [options, setOptions] = useState<Options>({
    width: 300,
    height: 300,
    type: "svg",
    data: "",
    image: "",
    margin: 1,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: "Q",
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 10,
      crossOrigin: "anonymous",
      saveAsBlob: true,
    },
    dotsOptions: {
      color: "#222222",
    },
    backgroundOptions: {
      color: "#cccccc",
    },
  });
  const [fileExt, setFileExt] = useState<FileExtension>("svg");
  const [inputValue, setInputValue] = useState<string>("");
  const [qrCode, setQrCode] = useState<QRCodeStyling>();
  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setQrCode(new QRCodeStyling(options));
  }, []);

  useEffect(() => {
    if (ref.current) {
      qrCode?.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    if (!qrCode) return;
    qrCode?.update(options);
  }, [qrCode, options]);

  const onDataChange = (data: string) => {
    setOptions((options) => ({
      ...options,
      data,
    }));
  };

  const onExtensionChange = (event: FileExtension) => {
    setFileExt(event);
  };

  const onDownloadClick = () => {
    if (!qrCode) return;
    qrCode.download({
      extension: fileExt,
    });
  };
  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post<
        ApiResponse<ApiResponseCreateLink>
      >("/v1/urls/create", {
        longUrl: inputValue,
        isQR: true,
      });
      if (!data.success) {
        ToastFn("error", "Failed", data.message);
        return;
      }
      const shortURl = `${import.meta.env.VITE_FRONTEND_URL}/${
        data.data.ShortURL
      }`;
      onDataChange(shortURl as string);
    } catch (error: AxiosError | ApiResponse<ApiResponseCreateLink> | any) {
      if (isAxiosError(error)) {
        ToastFn(
          "error",
          "Error",
          error.response?.data.message || "Something went wrong"
        );
      }
      ToastFn("error", "Error", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const HandleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOptions((prevOptions) => ({
          ...prevOptions,
          image: reader.result as string, // Set the image to the file data URL
        }));
      };
      reader.readAsDataURL(file); // Read the image as a base64 data URL
    }
  };

  return (
    <div className="w-full">
      <form className="flex flex-col gap-5" onSubmit={HandleSubmit}>
        <div>
          <label
            htmlFor="QrcodeShorter"
            className="block mb-2 text-4xl font-bold max-md:text-xl"
          >
            Paste your long link here
          </label>
          <Input
            type="text"
            id="QrcodeShorter"
            placeholder="Enter your long link"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            required
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label htmlFor="picture">QR Image</label>
          <Input id="picture" type="file" onChange={HandleImageUpload} />
        </div>
        <Button
          className="w-1/3 mb-4 mx-auto max-md:w-full"
          variant={"outline"}
          type="submit"
        >
          {isLoading ? "Generating QR code..." : "Generate QR code"}
        </Button>
      </form>
      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-2">
        <div ref={ref} id="qrcode-preview" />
        {((options?.data?.length as number) || 0) > 0 && (
          <div>
            <div className="flex flex-col gap-2">
              <label className="">Download type</label>
              <Select onValueChange={onExtensionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="SVG" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="svg">SVG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="webp">WEBP</SelectItem>
                </SelectContent>
              </Select>

              <Button variant={"outline"} onClick={onDownloadClick}>
                Download
              </Button>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="picture">Change the color of the dotss</label>
              <Input
                type="color"
                className="w-1/3"
                value={options?.dotsOptions?.color || "#222222"}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    dotsOptions: { color: e.target.value },
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRcodeGenerator;
