"use client";
import Image from "next/image";
import logo from "./../../../assets/task.png";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const id = useParams().id;

  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [is_completed, setIsCompleted] = useState<boolean>(false);
  const [image_flie, setImageFlie] = useState<File | null>(null);
  const [preview_file, setPreviewFile] = useState<string | null>(null);
  const [old_image_file, setOldImageFile] = useState<string | null>(null);

  //ดึงข้อมูลจาก supabase มาแสดงหน้าจอตาม id ที่ได้มาจาก url
  useEffect(() => {
    //ดึงข้อมูลจาก supabase
    async function fetchData() {
      const { data, error } = await supabase
        .from("task_tb")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("พบข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง...");
        console.log(error);
        return;
      }
      //เอาข้อมูลที่ดึงมาจาก supabase มาแสดงบนหน้าจอ
      setTitle(data.title);
      setDetail(data.detail);
      setIsCompleted(data.is_completed);
      setPreviewFile(data.image_url);
    }

    fetchData();
  }, []);

  //ฟังก์ชันเลือกรูปภาพเพื่อพรีวิวก่อนที่จะอัปโหลด
  function handleSelectImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;

    setImageFlie(file);

    if (file) {
      setPreviewFile(URL.createObjectURL(file as Blob));
    }
  }
  //ฟังก์ชันอัปโหลดรูปภาพ และบันทึกลงฐานข้อมูลที่ Supabase
  async function handleUploadAndUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //สร้างตัวแปรเพื่อเก็บ url ของรูปภาพที่อัปโหลด เพื่อจะเอาไปบันทึกตาราง
    let image_url = preview_file || "";

    //ตรวจสอบว่ามีการเลือกรูปภาพเพื่อที่จะอัปโหลดหรือไม่
    if (image_flie) {
      //ลบรูปภาพเก่าออกใน supabase เพื่ออัปโหลดรูปใหม่
      if (old_image_file != "") {
        //เอาเฉพาะชื่อของรูปภาพจาก image_url
        const image_name = image_url.split("/").pop() as string;
        const { data, error } = await supabase.storage
          .from("task_bk")
          .remove([image_name]);

        if (error) {
          alert("พบข้อผิดพลาดในการลบรูปภาพ กรุณาลองใหม่อีกครั้ง...");
          console.log(error);
          return;
        }
      }

      //กรณีมีการเลือกรูป ก็จะทำการอัปโหลดรูปไปยัง storage ของ supabase
      const new_image_flie_name = `${Date.now()}-${image_flie?.name}`;
      //อัปโหลดรูป
      const { data, error } = await supabase.storage
        .from("task_bk")
        .upload(new_image_flie_name, image_flie);

      if (error) {
        alert("พบข้อผิดพลาดในการอัปโหลดรูปภาพ กรุณาลองใหม่อีกครั้ง");
        console.log(error.message);
        return;
      } else {
        // get url ของรูปที่
        const { data } = supabase.storage
          .from("task_bk")
          .getPublicUrl(new_image_flie_name);
        image_url = data.publicUrl;
      }
    }

    //---------แก้ไขลงตาราง supabase---------
    const { data, error } = await supabase
      .from("task_tb")
      .update({
        title: title,
        detail: detail,
        is_completed: is_completed,
        image_url: image_url,
        update_at: new Date().toISOString(),
      })
      .eq("id", id);

    //ตรวจสอบ
    if (error) {
      alert("พบข้อผิดพลาดในการแก้ไขข้อมูล กรุณาลองใหม่อีกครั้ง");
      console.log(error.message);
      return;
    } else {
      alert("บันทึกข้อมูลเรียบร้อย");
      //เคลียร์ข้อมูล
      setTitle("");
      setDetail("");
      setIsCompleted(false);
      setImageFlie(null);
      setPreviewFile(null);
      image_url = "";
      //redirect กลับไปหน้า แสดงงานทั้งหมด
      router.push("/alltask");
    }
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
          <h1 className="text-center text-xl font-bold">🔻🔺แก้ไขงานเก่า</h1>

          <form onSubmit={handleUploadAndUpdate}>
            <div className="flex flex-col mt-5">
              <label className="text-lg font-bold">งานที่ทำ</label>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col mt-5">
              <label className="text-lg font-bold">รายละเอียดงาน</label>
              <textarea
                className="border border-gray-300 p-2 rounded-lg"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              ></textarea>
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
              <select
                className="border border-gray-300 p-2 rounded-lg"
                value={is_completed ? "1" : "0"}
                onChange={(e) => setIsCompleted(e.target.value === "1")}
              >
                <option value="0">ยังไม่เสร็จสิ้น</option>
                <option value="1">เสร็จสิ้น</option>
              </select>
            </div>

            <div className="flex flex-col mt-5">
              <button
                type="submit"
                className="bg-green-500 rounded-lg p-2 text-white"
              >
                บันทึกแก้ไขงาน
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
