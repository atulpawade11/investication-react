type Props = {
  title: string;
  description: string;
  image: string;
};

export default function CTASection({ title, description, image }: Props) {
  return (
    <div className="max-w-6xl mx-auto mt-12 bg-gradient-to-r from-[#0B4F8A] to-[#0B2C4A] rounded-lg text-white grid md:grid-cols-[3fr_7fr] overflow-hidden">
      {/* Image Section (30%) */}
      <div className="relative w-full h-full min-h-[200px]">
        {/*<img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover" 
        />*/}
        <img 
          src="/connect.png" 
          alt={title} 
          className="h-full w-full object-cover" 
        />
      </div>

      {/* Text Section (70%) */}
      <div className="p-8 md:p-12 flex flex-col justify-center">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-base opacity-90 leading-relaxed max-w-3xl">
          {description}
        </p>
      </div>
    </div>
  );
}


