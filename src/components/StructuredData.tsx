import { Helmet } from 'react-helmet-async';
import { Property } from '@/lib/types';

interface StructuredDataProps {
    type: 'property' | 'organization' | 'breadcrumb';
    data?: Property;
}

export function StructuredData({ type, data }: StructuredDataProps) {
    const getStructuredData = () => {
        switch (type) {
            case 'organization':
                return {
                    '@context': 'https://schema.org',
                    '@type': 'RealEstateAgent',
                    name: 'V Horizon Properties',
                    url: 'https://vhorizonproperties.com',
                    logo: 'https://vhorizonproperties.com/logo.png',
                    description: 'Leading real estate agency in Delhi NCR',
                    address: {
                        '@type': 'PostalAddress',
                        addressCountry: 'IN',
                        addressRegion: 'Delhi',
                    },
                };

            case 'property':
                if (!data) return null;
                return {
                    '@context': 'https://schema.org',
                    '@type': 'RealEstateListing',
                    name: data.title,
                    description: data.description,
                    url: `https://vhorizonproperties.com/property/${data.id}`,
                    image: data.heroImage,
                    price: {
                        '@type': 'PriceSpecification',
                        price: data.price,
                        priceCurrency: 'INR',
                    },
                    address: {
                        '@type': 'PostalAddress',
                        addressLocality: data.location,
                        addressCountry: 'IN',
                    },
                    numberOfRooms: data.beds,
                    numberOfBathroomsTotal: data.baths,
                    floorSize: {
                        '@type': 'QuantitativeValue',
                        value: data.sqft,
                        unitCode: 'SQF',
                    },
                };

            default:
                return null;
        }
    };

    const structuredData = getStructuredData();
    if (!structuredData) return null;

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
}
