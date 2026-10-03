import {
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: TruckIcon,
    title: "Free Shipping",
    text: "On orders over 500 EGP",
  },
  {
    icon: ArrowPathIcon,
    title: "Easy Returns",
    text: "30-day return policy",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure Payment",
    text: "100% protected checkout",
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: "24/7 Support",
    text: "We're here to help",
  },
];

export default function TrustFeatures() {
  return (
    <section className="border-y border-emerald-100 bg-emerald-50/60 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
              <Icon className="size-6" />
            </span>
            <div>
              <p className="font-semibold text-slate-800">{title}</p>
              <p className="text-sm text-slate-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
