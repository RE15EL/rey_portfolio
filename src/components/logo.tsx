import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="#home">
      <Image src={"/images/logo_dark.png"} alt="Logo" width={38} height={38} />
    </Link>
  );
};
