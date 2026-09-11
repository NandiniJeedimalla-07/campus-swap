import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail } from 'lucide-react';

const faqs = [
  {
    question: "How do I rent an item?",
    answer: "Browse the available items, click on one you're interested in, and send a rental request. The seller will review and respond to your request."
  },
  {
    question: "How do payments work?",
    answer: "Payment terms are arranged directly between you and the seller. We recommend using secure payment methods and meeting in public places on campus."
  },
  {
    question: "What if an item is damaged?",
    answer: "You're responsible for returning items in the same condition. Discuss damage policies with the seller before renting."
  },
  {
    question: "Can I cancel a rental?",
    answer: "Contact the seller directly to discuss cancellation. Early communication is key to resolving any issues."
  },
];

const BuyerHelp = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
          <p className="text-muted-foreground mt-1">
            Find answers and get help
          </p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Contact Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Need more help? Reach out to our support team.
            </p>
            <div className="flex gap-3">
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Button>
              <Button variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BuyerHelp;
