"use client";
import Image from "next/image";
import logo from "./../../assets/task.png";
import Link from "next/link";
import React, { useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function Page() {
  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [is_completed, setIsCompleted] = useState<boolean>(false);
  const [image_flie, setImageFlie] = useState<File | null>(null);
  const [preview_file, setPreviewFile] = useState<string>("");

  //ฟังก์ชันเลือกรูปภาพเพื่อพรีวิวก่อนที่จะอัปโหลด
  function handleSelectImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;

    setImageFlie(file);

    if (file) {
      setPreviewFile(URL.createObjectURL(file as Blob));
    }
  }
  //ฟังก์ชันอัปโหลดรูปภาพ และบันทึกลงฐานข้อมูลที่ Supabase
  async function handleUploadAndSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("อัปโหลดรูปภาพและบันทึกข้อมูล");
  }

  return (
    <>
      <div className="flex flex-col w-10/12 mx-auto">
        <div className="flex flex-col items-center mt-20">
          <Image src={logo} alt="logo" width={100} height={100} />
          <h1 className="text-xl font-bold mt-5">Manage Task App</h1>
          <h1 className="text-xl font-bold ">บันทึกงานที่ต้องทำ</h1>
        </div>

        {/*ส่วนของเพิ่มงานใหม่*/}
        <div className="mt-10 flex flex-col border border-gray-500 p-5 rounded-xl ">
          <h1 className="text-center text-xl font-bold">เพิ่มงานใหม่</h1>

          <form>
            <div className="flex flex-col mt-5">
              <label className="text-lg font-bold">งานที่ทำ</label>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-lg"
              />
            </div>

            <div className="flex flex-col mt-5">
              <label className="text-lg font-bold">รายละเอียดงาน</label>
              <textarea className="border border-gray-300 p-2 rounded-lg"></textarea>
            </div>

            <div className="flex flex-col mt-5">
              <label className="text-lg font-bold">อัปโหลดรูปภาพ</label>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleSelectImagePreview}
              />
              <label
                htmlFor="fileInput"
                className="bg-blue-500 rounded-lg p-2 text-white cursor-pointer w-30 text-center"
              >
                เลือกรูป
              </label>
              {preview_file && (
                <div className="mt-3">
                  <Image
                    src={preview_file}
                    alt="preview"
                    width={100}
                    height={100}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col mt-5">
              <label className="text-lg font-bold">สถานะงาน</label>
              <select className="border border-gray-300 p-2 rounded-lg">
                <option value="0">ยังไม่เสร็จสิ้น</option>
                <option value="1">เสร็จสิ้น</option>
              </select>
            </div>

            <div className="flex flex-col mt-5">
              <button
                type="submit"
                className="bg-green-500 rounded-lg p-2 text-white"
              >
                บันทึกเพิ่มงาน
              </button>
            </div>
          </form>

          {/*ส่วนลิงค์กลับไปหน้าแสดงงานทั้งหมด*/}
          <div className="flex justify-center mt-10">
            <Link
              href="/alltask"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              กลับไปแสดงงานทั้งหมด
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
