const form=document.querySelector('#business-form');
const interest=document.querySelector('#interest');
const details=document.querySelector('#business-details');
const updateHint=()=>{details.placeholder=interest.value==='Imóveis'?'Ex.: apartamento em Fortaleza, bairro de interesse e faixa de valor.':'Ex.: modelo, ano e faixa de valor. Se for vender, conte também a quilometragem.'};
interest.addEventListener('change',updateHint);
document.querySelectorAll('[data-interest]').forEach(link=>link.addEventListener('click',()=>{interest.value=link.dataset.interest;updateHint()}));
form.addEventListener('submit',event=>{
 event.preventDefault();
 const category=interest.value==='Veículos'?'veículo':'imóvel';
 const goal=document.querySelector('#objective').value.toLowerCase();
 const extra=details.value.trim();
 const message=`Olá, Diego! Vim pela Guerra Negócios. Tenho interesse em ${goal} um ${category}.${extra?'\n\n'+extra:''}`;
 window.open('https://wa.me/5585996119154?text='+encodeURIComponent(message),'_blank','noopener');
});
