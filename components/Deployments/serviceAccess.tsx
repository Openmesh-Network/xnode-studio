import { ServiceData, ServiceOption, ServiceFromName, XnodeConfig } from "@/types/dataProvider";
import Header from '@/components/ui/header'
import { useState } from "react";
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'

export function formatSSHKeys(keys: string): string {
    if (keys.includes('[]')){
        keys.replace('[]', '')
    }
    return keys.split('\n').map(key => "\"" + key.trim() + "\"").join(` `);
}

export function sshUserData(inputSshKey) {
    const formattedSSHKeys = formatSSHKeys(inputSshKey)
    const userData: ServiceData ={
        name: "xnode",
        tags: [],
        specs: {ram:0,storage:0},
        desc: "Xnode access via SSH",
        nixName: "\"xnode\"",
        options: [{
            name: "openssh.authorizedKeys.keys",
            nixName: "openssh.authorizedKeys.keys",
            desc: "ssh key",
            type: "list of string",
            value: `[${formattedSSHKeys}]`
    
        }]
    };
    return userData
}

// 
const ServiceAccess = ({ currentService, ip, startingUserData, updatedUserData }: 
    { currentService: ServiceData[], ip: string, startingUserData: ServiceData, updatedUserData: any}) => {
        const services = currentService

        function portFromName(serviceName) {
            let accessingService = ServiceFromName(serviceName);
            return accessingService?.options.find((option) => option.name === "port")?.value
        }
        const [isSSHPopupOpen, setSSHIsPopupOpen] = useState(false);

        let userData = startingUserData


        // Handle userdata logic here (for now)
        const nixSshKeyToHtmlString = (sshKey: string) => {
            let ret = sshKey.replaceAll("[", "").replaceAll("]","").replaceAll("\" ", "\n").replaceAll("\"", "")

            return ret
        } 

        const sshKeyOption = userData?.options?.find(option => option.nixName === "openssh.authorizedKeys.keys");
        const sshKeys = sshKeyOption ? nixSshKeyToHtmlString(sshKeyOption.value): "";
        const [sshKey, setSshKey] = useState<string>(sshKeys);
        
        return (
            <>
                <Header level={2}>Access</Header>

                <p> Running on {ip} </p>

                {services.map((service) => (
                    <div key={service.nixName} className="access">
                        <a href={`http://${ip}:${portFromName(service.nixName)}`}
                            style={{
                            color: 'blue',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            }}
                        >
                            {service.nixName}
                        </a>            
                        <br />
                    </div>
                ))}

                {/* <TextInputPopup */}
                {/*     isOpen={isSSHPopupOpen} */}
                {/*     onClose={() => setSSHIsPopupOpen(false)} */}
                {/*     setInputValue = {setSSHKey} */}
                {/*     curValue={sshKeys} */}
                {/* /> */}


                { 
                    sshKey && (
                        <div className="auto block w-full overflow-auto border p-2"> <p className="text-nowrap"> {sshKey} </p> </div>
                    )
                }
                <Dialog>
                    <div className="flex items-center space-x-4">
                        <DialogTrigger className="inline-flex h-10 min-w-24 items-center justify-center whitespace-nowrap rounded-md border border-primary bg-primary/95 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            Edit
                        </DialogTrigger>
                    </div>

                    <DialogContent style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <DialogHeader>
                            <DialogTitle>Edit ssh keys.</DialogTitle>
                            <DialogDescription> Enter whitelisted ssh keys separated by newlines. </DialogDescription>
                        </DialogHeader>

                        <textarea
                            value={sshKey}
                            onChange={(e) => setSshKey(e.target.value)}
                            className="mb-4 h-32 w-full resize-none text-nowrap rounded border border-gray-300 p-2"
                            placeholder="Enter ssh key..."
                        />

                        <DialogFooter>
                            <DialogClose> Close </DialogClose>
                            <DialogClose onClick={() => updatedUserData(sshUserData(sshKey))}> Save </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        )
    }
    export default ServiceAccess;
