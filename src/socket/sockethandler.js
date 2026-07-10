const Locker = require("../models/locker");
// sending locker data to client after socket connection 
exports.LockerHandler = (socket, io) => {

    socket.on("getlocker", async () => {
        try {
            const lockers = await Locker.find();
            console.log("Sending lockers data to client:", lockers);

            socket.emit("lockerdata", lockers);

        } catch (error) {
            console.error("Error fetching lockers:", error);

        }
    });

};
//temparily lock locker for 6 minet after user click on locker and 
// if user not booked locker after 6 minet then locker will be available
//  for other user
exports.TempLockHandler = (socket, io) => {
    socket.on("templock", async (data) => {
        const lockerId = data.lockerId;
    
        try{
            await Locker.findOneAndUpdate({ lockId: lockerId,
                status: "available"
             }, { status: "templock" }, { new: true });
             socket.broadcast.emit("templockerdata", {
                lockerId: lockerId,
                status: "templock"
             });
        }
        catch(error){
            console.error("Error updating locker status:", error);
            socket.emit("templockerdata", {
                lockerId: lockerId,
                message: "Failed to update locker status"
             });
        }
    })
};
// unlock temparily locked locker and make it available for other user
exports.UnlockTempLockHandler = (socket, io) => {
    socket.on("unlocktemplock", async (data) => {
        const lockerId = data.lockerId;
        
        try{
            await Locker.findOneAndUpdate({ 
                lockId: lockerId,
                status: "templock"
            
            },
            {
               status: "available"
            },
                 { new: true }       
        );
            socket.broadcast.emit("unlocktemplockerdata", {
                lockerId: lockerId,
                status: "available"
             });
        }
        catch(error){
            console.error("Error unlocking locker:", error);
            socket.emit("unlocktemplockerdata", {
                lockerId: lockerId,
                message: "Failed to unlock locker"
             });

        }
    })
}

//booked kocker and broadcast all
/*exports.BookedHandler = (socket, io) => {
    socket.on("templock", async (data) => {
        const lockerId = data.lockerId;
        const status = data.status;
        try{
            await Locker.findOneAndUpdate({ lockId: lockerId,
                status: "tempbook"
             }, { status: status }, { new: true } );
             io.emit("bookedlockerdata", {
                lockerId: lockerId,
                status: status
             });
        }
        catch(error){
            console.error("Error updating locker status:", error);
            socket.emit("bookedlockerdata", {
                lockerId: lockerId,
                message: "Failed to booked locker status"
             });
        }
    })
};
// unlock temparily locked locker and make it available for other user
/*exports.AvailableLockHandler = (socket, io) => {
    socket.on("unlocktemplock", async (data) => {
        const lockerId = data.lockerId;
        const status = data.status;
        try{
            await Locker.findOneAndUpdate({ 
                lockId: lockerId,
                status: "booked"
            },
            {
               status: status
            },
             { new: true } );
            io.emit("Availablelockerdata", {
                lockerId: lockerId,
                status: status
             });
        }
        catch(error){
            console.error("Error unlocking locker:", error);
            io.emit("Availablelockerdata", {
                lockerId: lockerId,
                message: "Failed to make locker available"
             });

        }
    })
}*/

