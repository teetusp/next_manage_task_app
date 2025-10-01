"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "./../../assets/task.png";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Task = {
  id: string;
  title: string;
  detail: string;
  is_completed: boolean;
  image_url: string;
  created_at: string;
  update_at: string;
};
export default function Page() {
  //สร้างตัวแปร state เพื่อเก็บข้อมุลที่ดึงมาจาก supabase
  const [tasks, setTasks] = useState<Task[]>([]);

  //เมื่อเพจถูกโหลด ให้ดึงข้อมูลจาก supabase เพื่อมาแสดงผลที่หน้าเพจ
  useEffect(() => {
    async function fetchTasks() {
      const { data, error } = await supabase
        .from("task_tb")
        .select(
          "id, title, detail, is_completed, image_url, created_at, update_at"
        )
        .order("created_at", { ascending: false });

      //หลังจากดึงข้อมูลมาตรวจสอบ error
      if (error) {
        alert("พบข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง...");
        console.error(error);
        return;
      }
      //ไม่พบ error
      if (data) {
        setTasks(data as Task[]);
      }
    }

    fetchTasks();
  }, []);

  return (
    <>
      <div className="flex flex-col w-10/12 mx-auto">
        <div className="flex flex-col items-center mt-20">
          <Image src={logo} alt="logo" width={100} height={100} />
          <h1 className="text-xl font-bold mt-5">Manage Task App</h1>
          <h1 className="text-xl font-bold ">บันทึกงานที่ต้องทำ</h1>
        </div>
        <div className="flex justify-end">
          <Link
            href="/addtask"
            className="mt-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-max rounded"
          >
            เพิ่มงาน
          </Link>
        </div>
        {/**/}
        <div className="mt-5">
          <table className="min-w-full border ">
            <thead className="bg-gray-400">
              <tr>
                <th className="border border-black p-2">รูป</th>
                <th className="border border-black p-2">งานที่ต้องทำ</th>
                <th className="border border-black p-2">รายละเอียด</th>
                <th className="border border-black p-2">สถานะ</th>
                <th className="border border-black p-2">วันที่เพื่ม</th>
                <th className="border border-black p-2">วันที่แก้ไข</th>
                <th className="border border-black p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {/*วนลูปตามจำนวนข้อมูลที่อยู่ในตัวแปร state: tasks*/}
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="border border-black p-2">
                    {task.image_url ? (
                      <Image
                        src={task.image_url}
                        alt="logo"
                        width={50}
                        height={50}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border border-black p-2 ">{task.title}</td>
                  <td className="border border-black p-2 ">{task.detail}</td>
                  <td className="border border-black p-2 " style={{ color: task.is_completed ? "green" : "red"}}>
                    {task.is_completed ? "เสร็จสิ้น" : "ยังไม่เสร็จสิ้น"}
                  </td>
                  <td className="border border-black p-2 ">
                    {new Date(task.created_at).toLocaleDateString()}
                  </td>
                  <td className="border border-black p-2 ">
                    {new Date(task.update_at).toLocaleDateString()}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {" "}
                    <Link href="/edittask">แก้ไข</Link>
                    <button>ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-10">
          <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">กลับไปหน้าแรก</Link>
        </div>
      </div>
    </>
  );
}
