import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";

import RaidenLogo from "../app/assets/raiden-new-png.png";
import Image from "next/image";
import Link from "next/link";

export default function RaidenNavbar() {
  return (
    <Navbar position="static">
      <NavbarBrand>
        <Image
          src={RaidenLogo}
          alt="Raiden"
          className="h-12 w-12 dark:invert"
        />
      </NavbarBrand>
      <NavbarContent
        className="hidden sm:flex gap-4 dark:text-zinc-500 text-zinc-500"
        justify="center"
      >
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive className="dark:text-zinc-300">
          <Link href="#" aria-current="page">
            Events?
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {/* <NavbarItem className="hidden lg:flex">
          <Link href="login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/signup" variant="flat">
            Sign Up
          </Button>
        </NavbarItem> */}
        <NavbarItem>
          <Button
            as={Link}
            href="/signup"
            className="border-zinc-300 text-zinc-600 border transition-all duration-150 bg-zinc-100 dark:bg-transparent dark:text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 dark:border-zinc-700 dark:hover:text-zinc-400"
          >
            Join waitlist
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
