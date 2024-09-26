import React from 'react';
import Header from '../../../components/Layout/Header';
import Footer from '../../../components/Layout/Footer';
import milkImage1 from '../../../assets/blog/milk1.jpg';
import milkImage2 from '../../../assets/blog/milk2.jpg';
import milkImage3 from '../../../assets/blog/milk3.jpg';
import milkImage4 from '../../../assets/blog/milk4.jpg';
import milkImage5 from '../../../assets/blog/milk5.jpg';
import milkImage6 from '../../../assets/blog/milk6.jpg';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  link: string;
}

const Blog: React.FC = () => {
  // Dummy data for blog posts
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'The Importance of Milk in Pregnancy',
      content: 'Although the number and types of studies provide insufficient evidence to offer definite conclusions, there appears to be an important trend of positive associations between moderate maternal milk intake during pregnancy and both infant birth weight and length. Randomized controlled trials are needed that examine the relations between maternal dairy product intake and the main pregnancy and lactation outcomes to provide women with specific dietary advice during these critical physiological periods regarding both themselves and their offspring.',
      imageUrl: milkImage1,
      link: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4302093/',
    },
    {
      id: 2,
      title: 'Choosing the Right Milk for Your Baby',
      content: 'Choosing the right formula for your baby involves considering various factors, including nutritional content, dietary needs, and potential allergies. By focusing on key ingredients like lactose, extra whey protein, and essential fatty acids, parents can select a formula that supports their infants growth and development. Remember, consulting with healthcare professionals and referring to guidelines from reputable organizations like the AAP and FDA can provide valuable guidance in making this important decision. At the end of the day, every baby is unique, and you know whats best for your little one!',
      imageUrl: milkImage2,
      link: 'https://babysonly.com/blogs/formula-101/how-to-choose-baby-formula',
    },
    {
      id: 3,
      title: 'Benefits of Breastfeeding',
      content: 'Breastfeeding can help protect babies against some short- and long-term illnesses and diseases.',
      imageUrl: milkImage3,
      link: 'https://reliefweb.int/report/world/5-ways-breastfeeding-helps-mothers-and-babies-alike?gad_source=1&gclid=Cj0KCQjw1qO0BhDwARIsANfnkv93aTLMmUG6Z8BSN1h2PtNgTYlCMklw22-JliOh0YwVVmbjRq9QeSgaAl7VEALw_wcB',
    },
    {
      id: 4,
      title: 'Cool Summer Milk Recipes',
      content: 'Summer is finally here and cool, tasty treats are in order. Here are a couple of recipes to help you stay fresh during the season, while getting your daily dose of Enfamama A+. As a bonus, they even help give relief not just from the heat, but also from two common problems every pregnant woman faces.',
      imageUrl: milkImage4,
      link: 'https://www.enfagrow.com.sg/articles/cool-summer-milk-recipes',
    },
    {
      id: 5,
      title: 'Milk Allergies in Babies',
      content: 'A milk allergy occurs when a child’s immune system mistakenly recognizes cow’s milk protein as a foreign invader. Milk allergies are most common in infants and young children.',
      imageUrl: milkImage5,
      link: 'https://www.chop.edu/conditions-diseases/milk-allergies',
    },
    {
      id: 6,
      title: 'Nutritional Value of Different Types of Milk',
      content: 'Milk is rich in calcium, and contains more than 10 essential nutrients that promote general health.',
      imageUrl: milkImage6,
      link: 'https://www.dairy.com.au/products/milk',
    },
  ];

  return (
    <>
      <Header />
      <section className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
              <img src={post.imageUrl} alt={post.title} className="mb-4 rounded-lg" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-gray-800 hover:text-blue-600 transition duration-300">{post.title}</h2>
              <p className="text-gray-700 leading-relaxed">{post.content}</p>
              <a href={post.link} className="text-blue-500 mt-2 inline-block hover:underline">Read more</a>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Blog;
