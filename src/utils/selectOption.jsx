import  { useState, useEffect } from "react";
import { Config } from "../config/connenct";
const api = Config.urlApi;

export function useProvince() {
  const [itemProvince, setItemProvince] = useState([]);

  useEffect(() => {
    const showProvince = async () => {
      try {
        const response = await fetch(api + 'province');
        const jsonData = await response.json();
        setItemProvince(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showProvince();
  }, []); 

  const data = itemProvince.map(item => ({ label: item.province_name, value: item.province_id }));

  return data;
}

// export function useDistrict(initialId = null) {
//   const [itemDistrict, setItemDistrict] = useState([]);
//   const [id, setId] = useState(initialId);

//   useEffect(() => {
//     const showDistrict = async (id) => {
//       if (id !== null) {
//         try {
//           const response = await fetch(`api/district/pv/${id}`);
//           const jsonData = await response.json();
//           setItemDistrict(Array.isArray(jsonData) ? jsonData : []);
//         } catch (error) {
//           console.error('Error fetching data:', error);
//         }
//       }
//     };
//     showDistrict();
//   }, [id]);
//   const data = itemDistrict.map(item => ({ label: item.district_name, value: item.district_id }));
//   return { data, setId };
// }

export function useOption() {
    const [itemOption, setItemOption] = useState([]);
  
    useEffect(() => {
      const showOptiongold = async () => {
        try {
          const response = await fetch(api + 'type/option');
          const jsonData = await response.json();
          setItemOption(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      showOptiongold();
    }, []); 
  
    const data = itemOption.map(item => ({ label: item.option_name, value: item.option_id }));
  
    return data;
  }
  
export function useType() {
  const [itemType, setItemType] = useState([]);

  useEffect(() => {
    const showTypegold = async () => {
      try {
        const response = await fetch(api + 'type');
        const jsonData = await response.json();
        setItemType(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showTypegold();
  }, []); 

  const data = itemType.map(item => ({ label: item.typeName, value: item.type_Id }));

  return data;
}


export function useUnite() {
    const [itemUnite, setItemUnite] = useState([]);
    useEffect(() => {
      const showUnitegold = async () => {
        try {
          const response = await fetch(api + 'unite');
          const jsonData = await response.json();
          setItemUnite(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      showUnitegold();
    }, []); 
  
    const data = itemUnite.map(item => ({ label: item.unite_name, value: item.unite_uuid }));
  
    return data;
  }


export function useTile() {
    const [itemTile, setItemTile] = useState([]);
    useEffect(() => {
      const showTilegold = async () => {
        try {
          const response = await fetch(api + 'tileps');
          const jsonData = await response.json();
          setItemTile(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      showTilegold();
    }, []); 
  
    const data = itemTile.map(item => ({ label: item.tile_name, value: item.tile_uuid }));
  
    return data;
  }

export function useZone() {
  const [itemZone, setItemZone] = useState([]);
  useEffect(() => {
    const showZoneSale = async () => {
      try {
        const response = await fetch(api + 'zone');
        const jsonData = await response.json();
        setItemZone(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showZoneSale();
  }, []); 

  const data = itemZone.map(item => ({ label: item.zone_name, value: item.zone_Id }));

  return data;
}


export function useStaff() {
  const [itemStaff, setItemStaff] = useState([]);
  useEffect(() => {
    const showZoneSale = async () => {
      try {
        const response = await fetch(api + 'staff');
        const jsonData = await response.json();
        setItemStaff(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    showZoneSale();
  }, []); 

  const data = itemStaff.map(item => ({ label: item.first_name+' '+item.last_name, value: item.staff_uuid }));

  return data;
}