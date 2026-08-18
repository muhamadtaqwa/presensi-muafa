export default function LoadingSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-16 bg-white rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
                <div className="h-20 bg-white rounded-xl" />
                <div className="h-20 bg-white rounded-xl" />
                <div className="h-20 bg-white rounded-xl" />
                <div className="h-20 bg-white rounded-xl" />
            </div>
            <div className="h-32 bg-white rounded-xl" />
        </div>
    );
}
