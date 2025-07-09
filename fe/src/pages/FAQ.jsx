import { useState } from "react";
import { MdExpandMore,MdExpandLess } from "react-icons/md";

const faqs = [
  {
    q: "What is MunchQuest?",
    a: "MunchQuest is a restaurant discovery site with reviews where users can browse restaurants, review restaurants, and administer restaurant listings. Restaurant owners can personalize their menus and administer their presence on the site."
  },
  {
    q: "Do I need an account to use MunchQuest?",
    a: "You can browse restaurants anonymously. But to review or administer restaurants, you will have to sign up or sign in with Firebase authentication."
  },
  {
    q: "How do I add a new restaurant?",
    a: "When you are logged in, go to the 'Add Restaurant' page. Complete the form with the information of the restaurant and submit it. If you are a verified owner, the restaurant will be included in the listing."
  },
  {
    q: "Can I edit or delete a restaurant?",
    a: "Yes — if you are the owner of the restaurant, you can delete or edit it from the restaurant's detail page. Unauthorised users won't be able to see the edit/delete links."
  },
  {
    q: "Who can edit menus for restaurants?",
    a: "Restaurant owners can edit menus. This gives you a completely customisable and dynamic experience for every restaurant listing."
  },
  {
    q: 'Why am i stuck on "Loading..."?',
    a: "Sometimes backend hosting services might have cold starts that result in minor delays. It usually resolves within 1-2 minutes"
  },
  {
    q: "How does reviewing work?",
    a: "Users can post a star rating and a brief review for any restaurant. Reviews are seen by every user and affect the restaurant's average rating."
  },
  {
    q: "Can I add images with a restaurant?",
    a: "No, not as of now. When adding a restaurant, a picture is assigned automatically from a curated collection, and owners can replace it through Cloudinary integration (coming soon)."
  },
  {
    q: "Is MunchQuest mobile-friendly?",
    a: "Definitely. The whole interface is responsive and mobile/desktop device-optimized using TailwindCSS."
  },
  {
    q: "How is my data secured?",
    a: "Authentication is managed through Firebase for safe login and session handling. Protected routes are accessible only to logged-in users, and sensitive operations such as edits or deletions can be performed."
  }
];


const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(Array(faqs.length).fill(false));

  const toggle = (i) => {
    setOpenIndex((old) => {
      const arr = [...old];
      arr[i] = !arr[i];
      return arr;
    });
  };

  return (
    <div className="w-5/6 mx-auto px-4 py-12 text-zinc-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      <div className="space-y-4 text-left">
        {faqs.map((item, i) => (
          <div
            key={i}
            className="border border-zinc-700 rounded-2xl bg-zinc-900 shadow-md overflow-hidden transition-all"
          >
            <button
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-zinc-800 transition-colors duration-200"
              onClick={() => toggle(i)}
            >
              <span className="text-lg font-semibold">{item.q}</span>
              <span className="text-zinc-400 text-3xl">
                {openIndex[i] ? <MdExpandLess /> : <MdExpandMore />}
              </span>
            </button>
            {openIndex[i] && (
              <div className="px-6 py-4 border-t border-zinc-700 text-zinc-300 text-md bg-zinc-950">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
