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
    icon: ShieldCheckIcon,
    title: "Secure Payment",
    text: "100% secure payment",
  },
  {
    icon: ArrowPathIcon,
    title: "Easy Returns",
    text: "30 day return policy",
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: "24/7 Support",
    text: "Dedicated support team",
  },
];

export default function HomeFeatures() {
  return (
    <section aria-label="Store benefits" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map(({ icon: Icon, title, text }) => (
        <div
          key={title}
          className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Icon className="size-6" />
          </span>
          <div>
            <h2 className="font-semibold text-slate-800">{title}</h2>
            <p className="text-sm text-slate-500">{text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
