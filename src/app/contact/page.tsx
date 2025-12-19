import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Get in Touch</h1>
          <p className="mt-4 text-lg text-gray-400">
            Tell us about your project and we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="mt-12 rounded-lg bg-gray-900 p-8 shadow-xl">
          <ContactForm source="contact_form" />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <h3 className="font-semibold text-white">Email</h3>
            <p className="mt-2 text-gray-400">contact@bespokeethos.com</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-white">Response Time</h3>
            <p className="mt-2 text-gray-400">Within 24 hours</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-white">Services</h3>
            <p className="mt-2 text-gray-400">B2B Consulting & AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
