import type { Metadata } from "next";
import AddressesComp from "../_component/AddressesComp/AddressesComp";

export const metadata: Metadata = {
  title: "My Addresses | FreshCart",
};

export default function AddressPage() {
  return <AddressesComp />;
}
