 import { Role } from "../../generated/prisma/enums"
import { envVars } from "../config/env";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma"

export const seedSupperAdmin =async()=>{
    try{
        const isSupperAdminExist = await prisma.user.findFirst({
            where:{
                role:Role.SUPER_ADMIN
            }
        })
        if(isSupperAdminExist){
            console.log("supper admin supper admin already exist, Skiping supper admin ");
            return
        }
        const suerAdminUser = await auth.api.signUpEmail({
            body:{
                email:envVars.SUPER_ADMIN_EMAIL,
                password:envVars.SUPER_ADMIN_PASSWORD,
                name:"super admin",
                role:Role.SUPER_ADMIN,
                needPasswordChange:false,
                rememberMe:false
            }
        });
     await prisma.$transaction(async (tx)=>{
            await tx.user.update({
                where:{
                    id:suerAdminUser.user.id
                },
                data:{
                   emailVerified:true
                }
            })
      await tx.admin.create({
                data:{
                    userId:suerAdminUser.user.id,
                    name:"Supper Admin",
                    email:envVars.SUPER_ADMIN_EMAIL,
                }
            })
        });
        const superAdmin = await prisma.admin.findFirst({
            where:{
                email:envVars.SUPER_ADMIN_EMAIL
            },
            include:{
                user:true
            }
        });
        console.log("super admin created :",superAdmin)
    }catch(err){
       console.error("Error creating supper admin",err)
 
       await prisma.user.delete({
           where:{
               email:envVars.SUPER_ADMIN_EMAIL
           }
       });
       await prisma.$disconnect();
       process.exit(1);
    }
}