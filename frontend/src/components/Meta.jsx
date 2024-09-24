import { Helmet } from 'react-helmet-async';

/**
 * Meta component to dynamically set the meta tags for SEO purposes.
 * This includes the page title, description, and keywords for search engines.
 *
 * @param {string} title - The title of the page to display in the browser tab and search results.
 * @param {string} description - The description of the page for search engines.
 * @param {string} keywords - The keywords relevant to the page content for SEO.
 *
 * @returns {JSX.Element} - A Helmet component for managing the document head's meta tags.
 */
const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

// Default props for better SEO optimization
Meta.defaultProps = {
  title:
    'Welcome to Mernmart - Best Online Store for Electronics, Gadgets, and More',
  description:
    'Shop at Mernmart for top-quality electronics, gadgets, home appliances, mobile devices, laptops, and more at unbeatable prices. Fast shipping and excellent customer service guaranteed.',
  keywords:
    'electronics, gadgets, home appliances, mobile devices, laptops, tablets, phones, gaming consoles, audio devices, cheap electronics, top electronics, affordable gadgets, best prices, Mernmart, buy electronics online, fast shipping, best online electronics store, quality products, latest electronics, technology, computer accessories, wearable tech, home gadgets, smart home devices, discounted electronics, trending gadgets, electronics deals, online electronics shopping',
};

export default Meta;
