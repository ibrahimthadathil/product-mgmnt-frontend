
type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type SpinnerColor = 'blue' | 'white' | 'gray' | 'green' | 'red' | 'indigo';

const Spinner = ({ size = 'md', color = 'indigo' }: { size?: SpinnerSize; color?: SpinnerColor }) => {
  const sizeClasses: Record<SpinnerSize, string> = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4'
  };

  const colorClasses: Record<SpinnerColor, string> = {
    blue: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-600 border-t-transparent',
    green: 'border-green-600 border-t-transparent',
    red: 'border-red-600 border-t-transparent',
    indigo: 'border-indigo-400 border-t-transparent'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

// Your Loading component with spinner
export default function Loading({height}:{height?:string}) {
  return (
    <div className={`flex justify-center text-indigo-400 items-center ${height ? height:"h-screen"}`}>
      <Spinner size="lg" color="indigo" />
    </div>
  );
}