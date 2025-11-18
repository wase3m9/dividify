import { Navigation } from "@/components/Navigation";
import { SiteBreadcrumbs } from "@/components/navigation/SiteBreadcrumbs";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

import { Helmet } from "react-helmet";
import { Mail, Phone, MapPin } from "lucide-react";
import ChatNotification from "@/components/chat/ChatNotification";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submit handler called");
    console.log("Form data:", formData);
    
    // Client-side validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      console.log("Form validation failed - empty fields");
      toast({
        title: "Please fill in all fields",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      console.log("Form validation failed - invalid email");
      toast({
        title: "Invalid email address",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    console.log("Form validation passed, submitting to Formsubmit");
    setIsSubmitting(true);
    
    try {
      // Create form data for submission
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('message', formData.message);
      submitData.append('_subject', 'Contact Form - Dividify Website');
      submitData.append('_template', 'table');
      submitData.append('_captcha', 'true');

      const response = await fetch('https://formsubmit.co/info@dividify.co.uk', {
        method: 'POST',
        body: submitData
      });

      console.log("Formsubmit response:", response.status, response.statusText);
      
      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you as soon as possible.",
        });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Dividify - Get Help with Dividend Vouchers & Board Minutes | Expert Support</title>
        <meta name="description" content="Contact Dividify for expert support with dividend vouchers, board minutes, and HMRC compliance. Get help from our UK company law specialists." />
        <meta name="keywords" content="contact dividify, dividend support, board minutes help, HMRC compliance support, UK company law assistance" />
        <meta name="geo.region" content="GB" />
        <meta name="geo.country" content="UK" />
        <meta name="geo.placename" content="London" />
        <meta property="og:title" content="Contact Dividify - Expert Support for UK Limited Companies" />
        <meta property="og:description" content="Get expert help with dividend vouchers, board minutes, and HMRC compliance from our UK company law specialists." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/contact`} />
        <meta property="og:locale" content="en_GB" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Contact Dividify | UK Support" />
        <meta name="twitter:description" content="Get expert help with dividend vouchers and HMRC compliance from our UK specialists." />
        <link rel="canonical" href={`${window.location.origin}/contact`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Dividify",
            "description": "Contact page for Dividify - UK dividend voucher and board minutes software support",
            "url": window.location.href,
            "mainEntity": {
              "@type": "Organization",
              "name": "Dividify",
              "url": window.location.origin,
              "logo": `${window.location.origin}/lovable-uploads/e4cf415e-3cbf-4e3b-9378-b22b2a036b60.png`,
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+44-20-7946-0958",
                  "contactType": "customer service",
                  "areaServed": "GB",
                  "availableLanguage": "English",
                  "hoursAvailable": "Mo-Fr 09:00-17:00"
                },
                {
                  "@type": "ContactPoint",
                  "email": "info@dividify.co.uk",
                  "contactType": "customer service",
                  "areaServed": "GB"
                }
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "124 City Road",
                "addressLocality": "London",
                "postalCode": "EC1V 2NX",
                "addressCountry": "GB"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "51.5274",
                "longitude": "-0.0890"
              }
            }
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-white">
      <Helmet>
        <title>Contact Dividify | UK Dividend Software Support | London</title>
        <meta name="description" content="Contact Dividify for support with dividend vouchers and board minutes software. Located in London, UK. Email info@dividify.co.uk or call +44 20 7946 0958" />
        <meta name="keywords" content="contact dividify, dividend software support, UK accounting software, London business contact, HMRC compliance support" />
        <meta name="geo.region" content="GB" />
        <meta name="geo.country" content="UK" />
        <meta name="geo.placename" content="London" />
        <meta property="og:title" content="Contact Dividify | UK Dividend Software Support" />
        <meta property="og:description" content="Contact Dividify for support with dividend vouchers and board minutes software. Located in London, UK." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:locale" content="en_GB" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Contact Dividify | UK Dividend Software Support" />
        <meta name="twitter:description" content="Contact Dividify for support with dividend vouchers and board minutes software. Located in London, UK." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-4">
        <SiteBreadcrumbs />
      </div>
      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h1 className="text-4xl font-bold mb-8">Contact Dividify</h1>
              <p className="text-gray-600 mb-8">
                Have a question about our dividend voucher software or need support? We're here to help UK limited companies and accountants with all their compliance needs.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#9b87f5] p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-left">For support, contact:</h3>
                    <p className="text-gray-600 text-left">info@dividify.co.uk</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#9b87f5] p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-left">Accountants and Agents sales:</h3>
                    <p className="text-gray-600 text-left">+44 20 7946 0958</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#9b87f5] p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-left">Registered office:</h3>
                    <p className="text-gray-600 text-left">124 City Road<br />London, EC1V 2NX<br />United Kingdom</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
          
            {isSubmitted ? (
              // Success state
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-6">
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </p>
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  className="bg-[#9b87f5] hover:bg-[#8b77e5]"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              // Form state
              <>
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            
                <form 
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div>
                    <Label htmlFor="name" className="text-left block">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-left block">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-left block">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="min-h-[150px]"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </>
            )}
            </div>
          </div>
        </div>
      </main>
        <Footer />
        <ChatNotification showOnLoad={true} delay={2000} />
      </div>
    </>
  );
};

export default Contact;