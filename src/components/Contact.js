import React, { useState } from 'react';
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
 const [formData, setFormData] = useState({
   name: '',
   email: '',
   subject: '',
   message: ''
 });

 // כתובות הרשתות החברתיות - החלף בקישורים האמיתיים שלך
 const socialLinks = {
   whatsapp: "https://wa.me/+972XXXXXXXXX", // החלף במספר הטלפון שלך
   instagram: "https://instagram.com/cludegym",
   facebook: "https://facebook.com/cludegym",
   tiktok: "https://tiktok.com/@cludegym",
   email: "contact@cludegym.com"
 };

 const handleSubmit = (e) => {
   e.preventDefault();
   // כאן תוכל להוסיף את הלוגיקה לשליחת המייל
   window.location.href = `mailto:${socialLinks.email}?subject=${formData.subject}&body=שם: ${formData.name}%0D%0Aאימייל: ${formData.email}%0D%0A%0D%0A${formData.message}`;
 };

 const handleChange = (e) => {
   setFormData({
     ...formData,
     [e.target.name]: e.target.value
   });
 };

 return (
   <div className="min-h-screen bg-gray-50" dir="rtl">
     <div className="container mx-auto px-4 py-8">
       <h1 className="text-4xl font-bold text-center mb-8">צור קשר</h1>

       <div className="max-w-4xl mx-auto">
         {/* רשתות חברתיות */}
         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
           <h2 className="text-2xl font-bold mb-6 text-center">בואו להיות חלק מהקהילה שלנו</h2>
           <div className="flex justify-center space-x-8 space-x-reverse">
           <a
               href={socialLinks.whatsapp}
               target="_blank"
               rel="noopener noreferrer"
               className="text-4xl text-green-500 hover:text-green-600 transition duration-300"
             >
               <FaWhatsapp />
             </a>
             <a
               href={socialLinks.instagram}
               target="_blank"
               rel="noopener noreferrer"
               className="text-4xl text-pink-500 hover:text-pink-600 transition duration-300"
             >
               <FaInstagram />
             </a>
             <a
               href={socialLinks.facebook}
               target="_blank"
               rel="noopener noreferrer"
               className="text-4xl text-blue-600 hover:text-blue-700 transition duration-300"
             >
               <FaFacebook />
             </a>
             <a
               href={socialLinks.tiktok}
               target="_blank"
               rel="noopener noreferrer"
               className="text-4xl text-black hover:text-gray-800 transition duration-300"
             >
               <FaTiktok />
             </a>
           </div>
         </div>

         {/* טופס יצירת קשר */}
         <div className="bg-white rounded-lg shadow-md p-6">
           <h2 className="text-2xl font-bold mb-6 text-center">שלח לנו הודעה</h2>
           <form onSubmit={handleSubmit} className="space-y-6">
             <div>
               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                 שם מלא
               </label>
               <input
                 type="text"
                 id="name"
                 name="name"
                 value={formData.name}
                 onChange={handleChange}
                 required
                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
               />
             </div>

             <div>
               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                 אימייל
               </label>
               <input
                 type="email"
                 id="email"
                 name="email"
                 value={formData.email}
                 onChange={handleChange}
                 required
                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
               />
             </div>

             <div>
               <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                 נושא
               </label>
               <input
                 type="text"
                 id="subject"
                 name="subject"
                 value={formData.subject}
                 onChange={handleChange}
                 required
                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
               />
             </div>

             <div>
               <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                 הודעה
               </label>
               <textarea
                 id="message"
                 name="message"
                 value={formData.message}
                 onChange={handleChange}
                 required
                 rows="4"
                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
               ></textarea>
             </div>

             <div className="flex justify-center">
               <button
                 type="submit"
                 className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
               >
                 <FaEnvelope className="inline-block ml-2" />
                 שלח הודעה
               </button>
             </div>
           </form>
         </div>
       </div>
     </div>
   </div>
 );
};

export default Contact;