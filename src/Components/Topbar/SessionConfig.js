import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from 'store/Store';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dropdown } from 'primereact/dropdown';
import UserApi from 'service/UserService';

export const SessionConfig = (props) => {
    const { t } = useTranslation();
    const [state, dispatch] = useContext(Context);
    const configMenu = useRef(null);
    const [organizationList, setOrganizationList] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState(null);

    useEffect(() => {
        if (state.user.id) {
            setOrganizationList(state.user.companiesList);
            setSelectedOrganization(localStorage.getItem("cid"));
        }
    }, [state.user]);

    /**
     * change organization
     */
    const changeOrganization = (e) => {
        setSelectedOrganization(e.value);
        UserApi.updateConfig({ "lastCompanyId": e.value }).then(res => {
            window.location.reload();
        })
    }

    return (
        <>
            {organizationList.length === 1 &&
                <span className="topbar-company-name p-d-none p-d-md-inline-flex">{state.user.currentCompany && state.user.currentCompany.name}</span>
            }
            {organizationList.length > 1 &&
                <div className="pointer p-d-flex p-ai-center" onClick={(event) => configMenu.current.toggle(event)}>
                    {/* <img src={CommonFunction.getImageUrl(null, state.user.currentCompany.name)} /> */}
                    <span className="topbar-company-name p-d-none p-d-md-inline-flex">{state.user.currentCompany && state.user.currentCompany.name}</span>
                    <i className='top-bar-username fs-20 bx bx-chevron-down p-d-md-inline-flex p-mr-1'></i>
                    <div className="p-d-md-none p-ml-1-5"></div>
                </div>
            }
            <OverlayPanel ref={configMenu} className="">
                <div className="p-d-flex p-ai-center p-mb-2">
                    <i className="bx bx-cog text-primary p-mr-1"></i>
                    <span className="bold-and-color">{t("topbar.config-session")}</span>
                </div>
                <div className="p-inputgroup">
                    <div className="p-inputgroup-addon">
                        <i className="fas fa-user-shield text-grey-7 p-mr-1"></i>
                        <span>{t('topbar.current-organization')}</span>
                    </div>
                    <Dropdown
                        value={selectedOrganization}
                        options={organizationList}
                        onChange={changeOrganization}
                        optionLabel="name"
                        optionValue="id"
                        filter
                        filterBy="name"
                        style={{ width: "400px" }}
                    />
                </div>



            </OverlayPanel>
        </>
    )
}
