import { Utensils, Stethoscope, Wrench, Droplet, Scissors, GraduationCap, ShoppingBag, Home } from "lucide-react";
import { Card } from "@/components/ui/card";

const categories = [
  { name: "Restaurants", icon: Utensils, color: "text-orange-500" },
  { name: "Hospitals", icon: Stethoscope, color: "text-red-500" },
  { name: "Electricians", icon: Wrench, color: "text-yellow-500" },
  { name: "Plumbers", icon: Droplet, color: "text-blue-500" },
  { name: "Salons", icon: Scissors, color: "text-pink-500" },
  { name: "Education", icon: GraduationCap, color: "text-purple-500" },
  { name: "Shopping", icon: ShoppingBag, color: "text-green-500" },
  { name: "Home Services", icon: Home, color: "text-indigo-500" },
];

interface CategoryGridProps {
  onCategoryClick: (category: string) => void;
}

const CategoryGrid = ({ onCategoryClick }: CategoryGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Card
          key={category.name}
          className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105 bg-card"
          onClick={() => onCategoryClick(category.name)}
        >
          <div className="flex flex-col items-center gap-3">
            <category.icon className={`h-10 w-10 ${category.color}`} />
            <span className="font-medium text-sm text-center">{category.name}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CategoryGrid;
