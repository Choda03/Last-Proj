import { AlertProps, AlertTitle, AlertDescription } from '@/components/ui/alert';

declare module '@/components/ui/alert' {
  export { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
  
  export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'destructive';
  }
  
  export const Alert: React.ForwardRefExoticComponent<
    AlertProps & React.RefAttributes<HTMLDivElement>
  > & {
    Title: typeof AlertTitle;
    Description: typeof AlertDescription;
  };
  
  export const AlertTitle: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>
  >;
  
  export const AlertDescription: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>
  >;
}
