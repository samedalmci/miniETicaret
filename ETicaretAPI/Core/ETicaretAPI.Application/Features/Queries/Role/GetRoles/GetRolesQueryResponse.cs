﻿namespace ETicaretAPI.Application.Features.Queries.Role.GetRoles
{
    public class GetRolesQueryResponse
    {
        public List<object> Datas { get; set; } = new List<object>();
        public int TotalCount { get; set; }
    }
}