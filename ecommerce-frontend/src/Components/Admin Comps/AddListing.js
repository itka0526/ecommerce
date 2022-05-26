import UploadInformation from "../Modal components/UploadInformation";

export default function AddListing({ setAuth, setUpdateContent, hide }) {
    return (
        <div className="h-full pt-[40px] w-full ">
            <UploadInformation hide={hide} setAuth={setAuth} />
        </div>
    );
}
