import { ServiceData, ServiceOption, ServiceFromName } from "@/types/dataProvider";
import Header from '@/components/ui/header'
import { useState } from "react";
import { Button } from '@/components/ui/button'
import TextInputPopup from '@/components/Deployments/InputEditor'

const ServiceAccess = ({ startingServices, ip}: { startingServices: ServiceData[], ip: string }) => {
    const services = startingServices
    function portFromName(serviceName) {
        let accessingService = ServiceFromName(serviceName);
        return accessingService?.options.find((option) => option.name === "port")?.value
    }
    const opensshconfig = {
        "nixName": "openssh",
        "options": [{ "nixName": "enable", "type": "boolean", "value": "true" },
        { "nixName": "settings.PasswordAuthentication", "value": "false", "type": "boolean" }, { "nixName": "settings.KbdInteractiveAuthentication", "value": "false", "type": "boolean" }]
      }
      const [isSSHPopupOpen, setSSHIsPopupOpen] = useState(false);
      const [sshKey, setSSHKey] = useState<string>(''); // TODO: Render without "" or [], add a helper description to explain separation by newlines

      // Handle userdata logic here (for now)
      

      return (
        <>
        <Header level={2}>Access</Header>

        <p> Running on {ip} </p>

        {services.map((service) => (
            <div key={service.nixName}>
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
        <p>Edit SSH Key</p>
        <div className="flex items-center space-x-4">

            <Button
            onClick={() => setSSHIsPopupOpen(true)}

            >
            Edit
            </Button>
            <Button>Save</Button>
        </div>
        <TextInputPopup
            isOpen={isSSHPopupOpen}
            onClose={() => setSSHIsPopupOpen(false)}
            setInputValue={setSSHKey}
            curValue={sshKey}
        />
        {sshKey && <p className="mt-4">SSH key: {sshKey}</p>}
        </>
    )
}
export default ServiceAccess;
