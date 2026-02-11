export const AppHeader = () => {
    return (
        <div className="flex items-center justify-between w-full">
            <h1 className="text-lg font-semibold text-gray-800">
                Dashboard
            </h1>

            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                    Offline
                </span>
            </div>
        </div>
    );
};
