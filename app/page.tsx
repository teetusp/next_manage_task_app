import Image from "next/image";
import Link from "next/link";
import logo from "../assets/task.png";
export default function HomePage() {
  return (
    <>
      <div className="flex flex-col items-center mt-20">
        <Image src={logo} alt="logo" width={100} height={100} />
        <h1 className="text-2xl font-bold mt-10">
          Manage Task App
        </h1>
        <h1 className="text-2xl font-bold ">
          บันทึกงานที่ต้องทำ
        </h1>
        <Link href="/alltask" className="mt-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-40 rounded">
          เข้าใช้งาน
        </Link>
      </div>
    </>
  );
}
