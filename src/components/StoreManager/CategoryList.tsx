import { MRT_ColumnDef } from "material-react-table";
import { useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import { ICategory } from "../../models/Category";
import CommonTable from "../Table/CommonTable";
import PopupCreateCategory from "../Popup/PopupCreateCategory";
import PopupCategoryDetail from "../Popup/PopupCategoryDetail";
import instance from "../../service/api/customAxios";


const columns: MRT_ColumnDef<ICategory>[] = [
  {
    accessorKey: "name",
    header: "Category name",
  },
];

const CategoryList = () => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [cateData, setCateData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [onPopupCategoryDetail, setOnPopupCategoryDetail] =
    useState<boolean>(false);

  const loadCategories = async () => {
    await instance.post('/categories/filter', { name: '' }).then(response => {
      setCategories(response.data.data);
    }).catch(error => console.log(error))
  }
  useEffect(() => {
    loadCategories()
  }, []);

  const handlePopupOpen = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleShowCategoryDetail = (cate: any) => {
    setCateData(cate);
    setOnPopupCategoryDetail(true);
  };

  return (
    <Stack sx={{ m: "2rem 0" }}>
      <CommonTable note={true}
        columns={columns}
        data={categories || []}
        onRowDoubleClick={handleShowCategoryDetail}
        toolbarButtons={
          <Button
            variant="contained"
            onClick={handlePopupOpen}
            sx={{
              color: "black",
              backgroundColor: "pink",
            }}
          >
            Add categories
          </Button>
        }
      />

      <PopupCreateCategory loadCategories={loadCategories}
        isPopupOpen={isPopupOpen}
        closePopup={handlePopupClose}
      />
      {cateData && (
        <PopupCategoryDetail loadCategories={loadCategories}
          cate={cateData}
          onPopupDetail={onPopupCategoryDetail}
          setOnPopupDetail={setOnPopupCategoryDetail}
        />
      )}
    </Stack>
  );
};

export default CategoryList;
