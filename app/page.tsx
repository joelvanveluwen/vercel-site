
import dynamic from 'next/dynamic';
import { BlogPosts } from 'app/components/posts';

// Dynamically import the P5Sketch component
const P5Sketch = dynamic(() => import('../components/P5Sketch'), {
  ssr: false, // This ensures the component is only rendered on the client side
});

export default function Page() {
  return (
    <section>
      <P5Sketch />
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1>
      <p className="mb-4">
        {`Joel writes a snazzy bio.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  );
}

