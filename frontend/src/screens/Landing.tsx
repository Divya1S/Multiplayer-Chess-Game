// export const Landing = () => {
//     return <div>
//         <div className="pt-8">
//             <div className="grid grid-cols-1 gap-4
//             md:grid-cols-2">
//                 <div className="flex justify-center">
//                     <img src={"/chess2.jpeg"}
//                     className="max-w-96" />
//                 </div>
//                 <div className="pt-16">
//                 <div className="flex justify-center">
//                     <h1 className="text-4xl
//                     font-bold text-white">Play chess Online on 
//                     the best Site!</h1>
//                   </div>  
//                     <div className="mt-4 flex justify-center">
//                         <button
//                         className="px-8 py-4 text-2xl bg-green-500
//                         hover:bg-blue-700 text-white
//                         font-bold py-2 px-4 rounded">
//                             Play Online
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// }

import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export const Landing = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header Section */}
            <header className="py-4 px-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">ChessMaster</h1>
                <nav>
                    <a href="#login" className="mr-4 hover:text-green-400">Login</a>
                    <a href="#signup" className="hover:text-green-400">Sign Up</a>
                </nav>
            </header>

            {/* Main Content */}
            <main className="pt-12 pb-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
                        {/* Chess Image */}
                        <div className="flex justify-center">
                            <img
                                src="/chess2.jpeg"
                                alt="Chess Board"
                                className="max-w-full h-auto rounded-lg shadow-lg md:max-w-md"
                            />
                        </div>
                        {/* Text and CTA */}
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                                Play Chess Online on the Best Site!
                            </h1>
                            <p className="text-lg text-gray-300 mb-6">
                                Join millions of players worldwide and test your skills in the ultimate chess experience.
                            </p>
                            <div className="flex justify-center md:justify-start">
                                <Button onClick={() => {
                                    navigate("/game")
                                }} 
                                className="px-8 py-4 text-xl bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition duration-300"
                                >
                                    Play Online
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} ChessMaster. All rights reserved.</p>
            </footer>
        </div>
    );
};