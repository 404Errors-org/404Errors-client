import styled from "@emotion/styled";

export const SearchField = styled.input`
    border: 1px solid ${props => props.theme.colors.primaryLight};
    padding: 8px 12px;
    padding-left: 43px;
    margin-bottom: 10px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 400;
    color: ${props => props.theme.colors.gray};
    background: ${(props) =>
        props.type === 'location'
            ? `url('/icons/location-search.svg') no-repeat 12px center`
            : props.type === 'search'
            ? `url('/icons/search.svg') no-repeat 12px center`
            : `none`},
                ${(props) => props.theme.colors.white};
    background-size: 18px;
     &:focus{
        outline: 2px solid ${props => props.theme.colors.primaryLight};
     }
`

export const RouteBox = styled.div`
    position: absolute;
    top: 15px;
    right: 20px;
    display: flex;
    flex-direction: column;
    width: 343px;
`