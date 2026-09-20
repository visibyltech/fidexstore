import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const EMAIL = "hello@chinedcloset.com";
const PHONE_DISPLAY = "+234 803 455 5302";
const WHATSAPP_NUMBER = "2348034555302";

export default function ContactPage() {
  return (
    <div className="pb-16">
      <div className="mx-10 mt-6 rounded-3xl bg-gradient-to-r from-black via-neutral-900 to-black px-6 py-14 text-center">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Get In <span className="text-gold">Touch</span>
        </h1>
        <p className="mt-3 text-sm text-white/50">
          Home <span className="text-gold">/</span> Contact
        </p>
      </div>

      <div className="mx-10 mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white/5 p-6 text-center">
          <MapPin className="mx-auto h-6 w-6 text-gold" />
          <h3 className="mt-3 text-sm font-semibold tracking-wide uppercase">Visit Us</h3>
          <p className="mt-2 text-sm text-white/60">
            11, Demurin Street, off Ikorodu Road, Ketu, Lagos.
          </p>
        </div>
        <div className="rounded-2xl bg-white/5 p-6 text-center">
          <Clock className="mx-auto h-6 w-6 text-gold" />
          <h3 className="mt-3 text-sm font-semibold tracking-wide uppercase">Opening Hours</h3>
          <p className="mt-2 text-sm text-white/60">
            Mon-Sat: 9:00am - 7:00pm
            <br />
            Sun: 12:00pm - 5:00pm
          </p>
        </div>
        <div className="rounded-2xl bg-white/5 p-6 text-center">
          <Phone className="mx-auto h-6 w-6 text-gold" />
          <h3 className="mt-3 text-sm font-semibold tracking-wide uppercase">Call Us</h3>
          <p className="mt-2 text-sm text-white/60">{PHONE_DISPLAY}</p>
        </div>
      </div>

      <div className="mx-10 mt-6 rounded-2xl bg-white/5 p-8 text-center">
        <Mail className="mx-auto h-6 w-6 text-gold" />
        <h3 className="mt-3 text-lg font-semibold">Prefer to reach out directly?</h3>
        <p className="mt-2 text-sm text-white/60">
          Email us or send a message on WhatsApp and we&apos;ll respond as soon as we can.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-semibold text-black transition hover:bg-gold/90"
          >
            <Mail className="h-4 w-4" /> {EMAIL}
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-md bg-white/10 px-6 py-3 text-sm font-semibold transition hover:bg-white/15"
          >
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
