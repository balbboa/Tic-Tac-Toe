import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface MenuCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const MenuCard = ({
  title = "Menu Option",
  description = "Description of this menu option and what it does.",
  icon = (
    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
      🎮
    </div>
  ),
  onClick = () => console.log("Card clicked"),
  disabled = false,
}: MenuCardProps) => {
  return (
    <Card className="w-[280px] h-[320px] flex flex-col transition-all duration-300 hover:shadow-lg bg-card dark:bg-card/90">
      <CardHeader className="pb-2">
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="h-full flex items-end">
          {/* Content can be added here if needed */}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          onClick={onClick}
          disabled={disabled}
          className="w-full justify-between"
        >
          <span>Open</span>
          <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuCard;
