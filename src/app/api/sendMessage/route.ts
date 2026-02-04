import UserModel from "@/model/User.model";
import { Message } from "@/types/schema";

export async function POST(request: Request) {
    const {username, content } = await request.json()
    const user = await UserModel.findOne();

    try {
        if (!user) {
            return Response.json({
                success: false,
                message: "User Not found"
            },{ status: 404 })
        }
    
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting messages"
            },{ status: 403 })
        }
    
        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message);
        
        await user.save()
    
        return Response.json({
                success: true,
                message: "message sent successfully"
            },{ status: 401 })
    
        } catch (error) {
            
            console.error("Error adding messages: ", error);
            return Response.json({
                success: false,
                message: "Internal server error"
            },{ status: 500 })
            
    }

}