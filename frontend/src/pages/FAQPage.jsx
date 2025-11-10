import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Users,
  Shield,
  CreditCard,
  Calendar,
  MessageCircle,
} from "lucide-react";

export default function FAQPage() {
  const [openItems, setOpenItems] = useState([0]);

  const faqCategories = [
    {
      id: "general",
      title: "General Questions",
      icon: HelpCircle,
      color: "#2ECC71",
      faqs: [
        {
          question: "What is this platform about?",
          answer:
            "Our platform connects customers with local service providers. Whether you need cleaning, plumbing, electrical work, or any other local service, you can find trusted professionals offering these services.",
        },
        {
          question: "How do I get started?",
          answer:
            "Getting started is easy! Simply create an account, browse available services by provider, read reviews from other customers on each service page, and book the service that meets your needs. You can compare services and reviews before making a decision.",
        },
        {
          question: "How do I find services?",
          answer:
            "You can browse all available services on our platform. Each service is offered by a specific provider, and you can view the service details, provider information, pricing, and customer reviews all on the service page.",
        },
      ],
    },
    {
      id: "booking",
      title: "Booking & Reservations",
      icon: Calendar,
      color: "#3498DB",
      faqs: [
        {
          question: "How do I book a service?",
          answer:
            'To book a service, browse our service listings, select the service you need, review the service details and customer reviews, then click "Reserve Service". The provider will receive your request and confirm the appointment details with you.',
        },
        {
          question: "Can I cancel or reschedule my booking?",
          answer:
            'Yes, you can cancel or reschedule your booking through your dashboard. Find your booking and select either "Cancel" or "Reschedule". Please contact the service provider as early as possible if you need to make changes to your reservation.',
        },
        {
          question: "What happens after I book a service?",
          answer:
            "After booking, the service provider will receive your request and confirm the appointment. You'll receive notifications about the status of your booking. The provider will arrive at your specified location at the scheduled time to complete the service.",
        },
        {
          question: "How can I see reviews for a service?",
          answer:
            "All customer reviews for a service are displayed on the service detail page. You can read reviews from other customers who have used the same service before making your booking decision.",
        },
      ],
    },
    {
      id: "payment",
      title: "Payment & Pricing",
      icon: CreditCard,
      color: "#E67E22",
      faqs: [
        {
          question: "How do I pay for a service?",
          answer:
            "Payment is made directly to the service provider after the service is completed. You only pay once your reservation is finished and you are satisfied with the service provided.",
        },
        {
          question: "When do I need to pay?",
          answer:
            "You pay after the service is completed. There is no advance payment required when making a reservation. Once the provider completes the service, you will pay them directly based on the agreed price.",
        },
        {
          question: "Are there any booking fees?",
          answer:
            "No, making a reservation on our platform is completely free. The price you see on the service page is what you will pay to the provider after the service is completed. There are no hidden platform fees.",
        },
        {
          question: "What if I'm not satisfied with the service?",
          answer:
            "If you're not satisfied with the service quality, please contact our support team before making payment. We have a dispute resolution process in place and can help mediate issues between you and the service provider.",
        },
      ],
    },
    {
      id: "providers",
      title: "Service Providers",
      icon: Users,
      color: "#9B59B6",
      faqs: [
        {
          question: "How can I learn about a service provider?",
          answer:
            "Each service page displays the provider's information including their name, contact details, and address. You can also read customer reviews for their services to learn about other customers' experiences.",
        },
        {
          question: "Can I contact the provider before booking?",
          answer:
            "Yes! The provider's phone number is displayed on each service page. Feel free to contact them directly if you have any questions about the service before making your reservation.",
        },
        {
          question: "How do I become a service provider?",
          answer:
            "If you're a professional service provider, you can apply to join our platform by clicking \"Join as Provider\" in the Nav Bar. You'll need to provide your business information and relevant licenses to get started.",
        },
      ],
    },
    {
      id: "safety",
      title: "Safety & Security",
      icon: Shield,
      color: "#E74C3C",
      faqs: [
        {
          question: "Is my personal information safe?",
          answer:
            "Yes, we take data security very seriously. All personal information is encrypted and stored securely. We never share your information with third parties without your consent, and we comply with all data protection regulations.",
        },
        {
          question: "What if I have a problem with a provider?",
          answer:
            "If you experience any issues with a service provider, please contact our support team immediately. We have a dispute resolution process in place and can help mediate issues to ensure a fair resolution.",
        },
        {
          question: "How are service providers verified?",
          answer:
            "All service providers must register on our platform and provide their business information. We monitor provider performance through customer reviews and ratings to maintain service quality standards.",
        },
      ],
    },
    {
      id: "support",
      title: "Support & Contact",
      icon: MessageCircle,
      color: "#16A085",
      faqs: [
        {
          question: "How can I contact customer support?",
          answer:
            "You can reach our customer support team via email at support@example.com or through our contact form available on the website. We're here to help you with any questions or concerns.",
        },
        {
          question: "How quickly will I get a response?",
          answer:
            "We aim to respond to all inquiries within 24-48 hours. Urgent issues related to active bookings are prioritized and handled as quickly as possible.",
        },
        {
          question: "Can I leave a review after using a service?",
          answer:
            "Yes! After your service is completed, you can leave a review on the service page. Your feedback helps other customers make informed decisions and helps providers improve their services.",
        },
      ],
    },
  ];

  const toggleItem = (categoryIndex, faqIndex) => {
    const itemId = `${categoryIndex}-${faqIndex}`;
    setOpenItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isItemOpen = (categoryIndex, faqIndex) => {
    return openItems.includes(`${categoryIndex}-${faqIndex}`);
  };

  return (
    <div style={{ backgroundColor: "#ECF0F1" }} className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#2ECC71" }}
            >
              <HelpCircle size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#2C3E50" }}>
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our platform, services, and
            how to get the most out of your experience.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            return (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {/* Category Header */}
                <div
                  className="p-6 border-b-4"
                  style={{ borderColor: category.color }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <CategoryIcon
                        size={24}
                        style={{ color: category.color }}
                      />
                    </div>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: "#2C3E50" }}
                    >
                      {category.title}
                    </h2>
                  </div>
                </div>

                {/* FAQ Items */}
                <div className="divide-y divide-gray-200">
                  {category.faqs.map((faq, faqIndex) => {
                    const isOpen = isItemOpen(categoryIndex, faqIndex);
                    return (
                      <div key={faqIndex}>
                        <button
                          onClick={() => toggleItem(categoryIndex, faqIndex)}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                        >
                          <span
                            className="font-semibold text-lg pr-4"
                            style={{ color: "#2C3E50" }}
                          >
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp
                              size={24}
                              style={{ color: category.color }}
                              className="flex-shrink-0"
                            />
                          ) : (
                            <ChevronDown
                              size={24}
                              style={{ color: category.color }}
                              className="flex-shrink-0"
                            />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4 pt-2">
                            <p className="text-gray-700 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
