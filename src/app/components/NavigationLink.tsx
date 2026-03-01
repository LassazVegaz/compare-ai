import Image from "next/image";
import Link from "next/link";
import { ComponentProps } from "react";

type NavigationLinkProps = {
  href: ComponentProps<typeof Link>["href"];
  src: ComponentProps<typeof Image>["src"];
  alt: ComponentProps<typeof Image>["alt"];
};

export default function NavigationLink(props: Readonly<NavigationLinkProps>) {
  return (
    <Link href={props.href}>
      <Image src={props.src} alt={props.alt} className="w-6 h-6" />
    </Link>
  );
}
