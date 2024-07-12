import { ServiceData, ServiceOption, ServiceFromName } from "@/types/dataProvider";
import Header from '@/components/ui/header'


const ServiceAccess = ({ startingServices, ip}: { startingServices: ServiceData[], ip: string }) => {
    const services = startingServices
    function portFromName(serviceName) {
        const service = ServiceFromName(serviceName);
        return service?.options.find((option) => option.name === "port")?.value
    }
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
        </>
    )
}
export default ServiceAccess;
