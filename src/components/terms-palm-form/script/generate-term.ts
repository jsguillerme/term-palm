import type { ComponentsComputerOptionLabel } from "../components"
import { ComponentsComputerOptions } from "../components"

type TermInput = {
  employee: string;
  cpf: string;
  deviceModel: string;
  imeiSerialDevice: string;
  isBrokenScreen: boolean;
  components?: ComponentsComputerOptionLabel[];
}

export function generateTermPdf(input: TermInput) {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(currentDate);
  const year = currentDate.getFullYear();

  const TERMS = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Termo de Responsabilização</title>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Nunito', sans-serif;
      font-size: 14px;
      color: #333;
      background-color: #f9f9f9;
      padding: 2rem;
      line-height: 1.6;
    }
    .container {
      background-color: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      max-width: 900px;
      margin: auto;
    }
    .logo {
      width: 8rem;
      display: block;
      margin-bottom: 1.5rem;
    }
    .title {
      text-align: center;
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 2rem;
      text-transform: uppercase;
      color: #222;
    }
    .equipment-box {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 1.5rem;
      margin: 1.5rem 0;
      background-color: #fefefe;
      text-align: center;
    }
    .terms-list {
      margin-left: 1.5rem;
    }
    .signature {
      text-align: center;
      margin-top: 3rem;
      font-weight: bold;
      text-decoration: overline;
    }
    .return-box {
      margin-top: 3rem;
      padding: 1rem;
      background-color: #f1f1f1;
      border-radius: 8px;
      border: 1px dashed #ccc;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <img
      src="https://www.alvoarlacteos.com.br/wp-content/uploads/2022/04/Landing-Page-Desktop.png"
      alt="Logo Alvoar Lácteos"
      class="logo"
    />

    <h2 class="title">
      Termo de Responsabilização pela Guarda e Uso de Equipamento de Trabalho
    </h2>

    <p>
      A <strong>ALVOAR LÁCTEOS NORDESTE S/A</strong>, nova denominação de BETÂNIA LÁCTEOS S/A, pessoa jurídica de direito privado,
      com matriz sediada na Rua Carlos Câmara, 1454, Jardim América, CEP: 60.425-810, Fortaleza – CE, inscrita no
      CNPJ nº 10.483.444/0001-89 e com filial no mesmo endereço, entrega neste ato o seguinte equipamento:
    </p>

    <div class="equipment-box">
      <strong>Acessórios:</strong> ${formatComponents(input.components || [])}<br>
      <strong>Modelo:</strong> ${input.deviceModel}<br>
      <strong>IMEI/SERIAL:</strong> ${input.imeiSerialDevice}<br>
      ${generateConditionScreenBroken(input.isBrokenScreen)}
    </div>

    <p>
      A pessoa de nome <b>${sanitizeEmployeeName(input.employee)}</b>, portadora do CPF/CNPJ <b>${sanitizeCpf(input.cpf)}</b>,
      doravante denominada simplesmente "<b>Usuário</b>", assume as seguintes condições:
    </p>

    <ol class="terms-list">
      <li>O equipamento deverá ser utilizado exclusivamente a serviço da empresa.</li>
      <li>O <b>Usuário</b> tem ciência que o equipamento contém dispositivo rastreador para localização.</li>
      <li>Responsabilidade pelo uso e conservação é do <b>Usuário</b>.</li>
      <li>Somente a posse é transferida, ficando proibido o empréstimo ou cessão a terceiros.</li>
      <li>Em caso de dano, a empresa poderá cobrar o valor do equipamento ao <b>Usuário</b>.</li>
      <li>Deve-se comunicar imediatamente em caso de extravio ou dano.</li>
      <li>Ao término do contrato, o equipamento deverá ser devolvido em perfeito estado.</li>
    </ol>

    <p style="margin-top: 2rem;">Fortaleza - CE, ${day} de ${month} de ${year}</p>

    <div class="signature">
      Nome do Responsável pelo equipamento
    </div>

    <div class="return-box">
      <p>Atestamos que o bem foi <b>devolvido</b> em ______ de ______ de ______, nas seguintes condições:</p>
      <p>
        ( &nbsp; ) Em perfeito estado &nbsp; | &nbsp; ( &nbsp; ) Apresentando defeito &nbsp; | &nbsp; ( &nbsp; ) Faltando peças/acessórios
      </p>
    </div>

    <div class="signature">
      Nome do Responsável pelo RECEBIMENTO do equipamento
    </div>
  </div>
</body>
</html>`;


  return TERMS;
}

function formatComponents(components: ComponentsComputerOptionLabel[]): string {
  const labels = components.map((componentId) => ComponentsComputerOptions.find((option) => option.id === componentId)?.label).filter((label) => !!label);

  return labels.length > 0 ? labels.join(', ') : '';
}

function generateConditionScreenBroken(screenBroken: boolean): string {
  if (!screenBroken) return ''

  return `<br><strong>Condições: PALM COM A TELA TRINCADA</strong></br>`
}

function sanitizeCpf(cpf: string) {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

function sanitizeEmployeeName(name: string) {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}