import React from "react";
import CheckoutForm from "./../CheckoutForm";

type Props = {
  params: {
    cartId: string;
  };
};
export default async function page(props: Props) {
  const params = await props.params;
  const { cartId } = params;

  return (
    <>
      <CheckoutForm cartId={cartId} />
    </>
  );
}
