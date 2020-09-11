const SET_COLLAPSE = 'SET_COLLAPSE'
const SET_ACTIVE_COMPANY = 'SET_ACTIVE_COMPANY'

const app = {
    state: {
        isCollapsed: false,
        activeCompany: null
    },
    mutations:{
        [SET_COLLAPSE](state){
            state.isCollapsed = !state.isCollapsed;
        },
        [SET_ACTIVE_COMPANY](state, activeCompany){
            state.activeCompany = activeCompany
        }
    },
    actions: {
        toggleCollapse({commit}){
            commit('SET_COLLAPSE');
        }
    }
}

export default app
